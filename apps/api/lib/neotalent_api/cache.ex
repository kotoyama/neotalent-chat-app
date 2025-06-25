defmodule NeotalentApi.Cache do
  @moduledoc """
  Simple Redis-backed cache for chat messages. We store the last N messages per user
  under the key `chat:<user_id>:messages` as a Redis list. Each list item is the
  JSON-encoded representation of the message map. We always push new messages to
  the head (LPUSH) and trim the list to `@max_messages` items.
  """

  @max_messages 10
  @redis_conn NeotalentApi.Redis

  @doc """
  Pushes a message struct (NeotalentApi.Chat.Message) into Redis cache for the
  associated user, keeping only the latest #{@max_messages} items.
  """
  def push_message(%{user_id: user_id} = message) do
    map = %{
      id: message.id,
      sender: message.sender,
      content: message.content,
      metadata: message.metadata,
      inserted_at: NaiveDateTime.to_iso8601(NaiveDateTime.truncate(message.inserted_at, :second))
    }

    json = Jason.encode!(map)
    key = key(user_id)

    commands = [
      ["LPUSH", key, json],
      ["LTRIM", key, "0", Integer.to_string(@max_messages - 1)]
    ]

    Enum.each(commands, fn cmd ->
      # We ignore errors in cache layer; they shouldn't break core flow.
      _ = Redix.command(@redis_conn, cmd)
    end)

    :ok
  end

  @doc """
  Retrieves the most recent `limit` messages for `user_id` from Redis cache.
  Returns an empty list if key is not found or on error. The returned list is in
  chronological order (oldest -> newest), matching DB ordering used elsewhere.
  """
  def get_recent_messages(user_id, limit \\ @max_messages) do
    case Redix.command(@redis_conn, [
           "LRANGE",
           key(user_id),
           "0",
           Integer.to_string(limit - 1)
         ]) do
      {:ok, list} ->
        list
        |> Enum.reverse()
        |> Enum.map(&decode!/1)

      _ ->
        []
    end
  end

  defp key(user_id), do: "chat:#{user_id}:messages"

  defp decode!(json) do
    Jason.decode!(json, keys: :atoms!)
  rescue
    _ -> %{}
  end
end

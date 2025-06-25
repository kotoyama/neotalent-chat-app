defmodule NeotalentApi.Chat do
  @moduledoc """
  The Chat context.
  """

  import Ecto.Query, warn: false
  alias NeotalentApi.Repo

  alias NeotalentApi.Chat.Message

  @doc """
  Fetches messages using cursor-based pagination.

  Query params:
    • `after` – return messages with `id` greater than the given id (newer messages).
  """
  def list_messages(user, params) do
    base_query = from(m in Message, where: m.user_id == ^user.id)

    after_id =
      case Map.get(params, "after") do
        id when is_integer(id) and id > 0 -> id
        str when is_binary(str) ->
          case Integer.parse(str) do
            {int_id, _} when int_id > 0 -> int_id
            _ -> nil
          end
        _ -> nil
      end

    query =
      if after_id do
        from(m in base_query, where: m.id > ^after_id, order_by: [asc: m.id])
      else
        from(m in base_query, order_by: [asc: m.id])
      end

    Repo.all(query)
  end

  @doc """
  Creates a message.

  ## Examples

      iex> create_message(%{field: value})
      {:ok, %Message{}} or {:error, %Ecto.Changeset{}}

  """
  def create_message(user, attrs \\ %{}) do
    attrs = Map.put(attrs, "user_id", user.id)

    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, message} = ok ->
        # Non-blocking cache update – ignore failures
        Task.start(fn -> NeotalentApi.Cache.push_message(message) end)
        ok

      error ->
        error
    end
  end

  @doc """
  Updates message status.
  """
  def update_message_status(%Message{} = message, status) when status in [:processing, :processed, :error] do
    message
    |> Message.changeset(%{"status" => status})
    |> Repo.update()
  end

  @doc """
  Returns total count of messages for a given user.
  """
  def count_messages(user) do
    Message
    |> where([m], m.user_id == ^user.id)
    |> select([m], count(m.id))
    |> Repo.one()
  end
end

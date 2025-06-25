defmodule NeotalentApi.Workers.AIWorker do
  alias NeotalentApi.Repo
  alias NeotalentApi.Chat
  alias NeotalentApi.Chat.Message
  alias NeotalentApi.AI.Client

  def perform(message_id) do
    message = Repo.get(Message, message_id) |> Repo.preload(:user)
    user = message.user

    # Fetch last 10 messages for context using Redis cache first
    messages =
      case NeotalentApi.Cache.get_recent_messages(user.id, 10) do
        [] -> Chat.list_messages(user, %{"limit" => 10, "sort" => "desc"})
        cached -> cached
      end

    case Client.fetch_calorie_estimation(messages) do
      {:ok, %Tesla.Env{status: 200, body: body}} ->
        raw_content = body["choices"] |> List.first() |> get_in(["message", "content"])

        json_string =
          raw_content
          |> String.replace(~r/^```json|^```|```$/m, "")
          |> String.trim()

        {content, metadata} =
          case Jason.decode(json_string) do
            {:ok, map} -> {"calorie_estimate", map}
            _ -> {raw_content, %{}}
          end

        Repo.transaction(fn ->
          # mark user message as processed
          Chat.update_message_status(message, :processed)

          # insert assistant reply
          Chat.create_message(user, %{
            "content" => content,
            "metadata" => metadata,
            "sender" => "assistant",
            "reply_to_id" => message.id
          })
        end)

      {:ok, %Tesla.Env{status: status, body: body}} ->
        IO.inspect("OpenAI API error: #{status} - #{inspect(body)}")
        Chat.update_message_status(message, :error)

      {:error, reason} ->
        IO.inspect("Tesla client error: #{inspect(reason)}")
        Chat.update_message_status(message, :error)
    end
  end
end

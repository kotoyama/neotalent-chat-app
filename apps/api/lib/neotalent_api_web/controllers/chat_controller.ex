defmodule NeotalentApiWeb.ChatController do
  use NeotalentApiWeb, :controller

  alias NeotalentApi.Chat
  alias NeotalentApi.Chat.Message
  alias NeotalentApi.Workers.AIWorker

  action_fallback NeotalentApiWeb.FallbackController

  def index(conn, params) do
    user = conn.assigns.current_user
    messages = Chat.list_messages(user, params)

    data = Enum.map(messages, fn m ->
      %{
        id: m.id,
        sender: m.sender,
        content: m.content,
        metadata: m.metadata,
        status: m.status,
        reply_to_id: m.reply_to_id,
        inserted_at: m.inserted_at
      }
    end)

    json(conn, data)
  end

  def create(conn, %{"content" => content}) do
    user = conn.assigns.current_user
    message_params = %{"content" => content, "sender" => "user", "status" => "processing"}

    with {:ok, %Message{} = message} <- Chat.create_message(user, message_params) do
      {:ok, _job} = Exq.enqueue(NeotalentApi.Exq, "default", AIWorker, [message.id])

      conn
      |> put_status(:created)
      |> json(%{messageId: message.id, status: "processing"})
    end
  end
end

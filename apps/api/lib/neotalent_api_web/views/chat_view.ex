defmodule NeotalentApiWeb.ChatView do
  use NeotalentApiWeb, :view

  alias NeotalentApiWeb.ChatView

  def render("index.json", %{messages: messages}) do
    render_many(messages, ChatView, "message.json")
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, ChatView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    %{
      id: message.id,
      sender: message.sender,
      content: message.content,
      metadata: message.metadata,
      inserted_at: message.inserted_at
    }
  end
end

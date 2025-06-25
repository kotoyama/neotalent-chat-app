defmodule NeotalentApi.Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset

  alias NeotalentApi.Accounts.User

  schema "messages" do
    field :content, :string
    field :sender, :string
    field :metadata, :map, default: %{}
    field :status, Ecto.Enum, values: [:processing, :processed, :error], default: nil
    belongs_to :reply_to, __MODULE__, foreign_key: :reply_to_id

    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:content, :sender, :user_id, :metadata, :status, :reply_to_id])
    |> validate_required([:content, :sender, :user_id])
    |> validate_inclusion(:sender, ["user", "assistant"])
  end
end

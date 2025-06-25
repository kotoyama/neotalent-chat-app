defmodule NeotalentApi.Repo.Migrations.CreateMessagesTable do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :content, :text, null: false
      add :sender, :string, null: false # 'user' or 'assistant'
      add :metadata, :map, default: %{}
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:messages, [:user_id])
  end
end

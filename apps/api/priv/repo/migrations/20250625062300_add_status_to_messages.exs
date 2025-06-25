defmodule NeotalentApi.Repo.Migrations.AddStatusToMessages do
  use Ecto.Migration

  def change do
    alter table(:messages) do
      add :status, :string
    end

    create constraint(
             :messages,
             :status_must_be_valid,
             check: "status IN ('processing','processed','error') OR status IS NULL"
           )
  end
end

defmodule NeotalentApi.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Bcrypt

  @derive {Jason.Encoder, only: [:email]}
  schema "users" do
    field :email, :string
    field :password_hash, :string

    # Virtual field for password confirmation
    field :password, :string, virtual: true

    timestamps()
  end

  @doc """
  A changeset for registering a new user.
  """
  def registration_changeset(struct, attrs) do
    struct
    |> cast(attrs, [:email, :password])
    |> validate_required([:email, :password])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/)
    |> validate_length(:password, min: 8, max: 72)
    |> unique_constraint(:email)
    |> put_password_hash()
  end

  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(changeset, :password_hash, Bcrypt.hash_pwd_salt(password))

      _ ->
        changeset
    end
  end
end

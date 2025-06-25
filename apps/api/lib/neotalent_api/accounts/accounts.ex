defmodule NeotalentApi.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias NeotalentApi.Repo

  alias NeotalentApi.Accounts.User

  @doc """
  Registers a user.

  ## Examples

      iex> register_user(%{email: "user@example.com", password: "some_password"})
      {:ok, %User{}} # | {:error, %Ecto.Changeset{}}

  """
  def register_user(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Returns an `%User{}` for a given email.
  """
  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Gets a user by ID.
  """
  def get_user(id) do
    Repo.get(User, id)
  end

  @doc """
  Authenticates a user by email and password.
  """
  def authenticate_user(email, password) do
    with %User{} = user <- get_user_by_email(email),
         true <- Bcrypt.verify_pass(password, user.password_hash) do
      {:ok, user}
    else
      _ -> :error
    end
  end
end

defmodule NeotalentApiWeb.AuthController do
  use NeotalentApiWeb, :controller

  alias NeotalentApi.Accounts

  action_fallback NeotalentApiWeb.FallbackController

  def create(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        conn
        |> put_session(:user_id, user.id)
        |> send_resp(:created, "")

      :error ->
        conn
        |> put_status(:bad_request)
        |> json(%{description: "Failed to authorize user"})
    end
  end
end

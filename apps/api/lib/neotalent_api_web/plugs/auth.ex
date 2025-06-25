defmodule NeotalentApiWeb.Plugs.Auth do
  import Plug.Conn
  import Phoenix.Controller

  alias NeotalentApi.Accounts

  def init(opts), do: opts

  def call(conn, :fetch_current_user) do
    user_id = get_session(conn, :user_id)
    user = user_id && Accounts.get_user(user_id)
    assign(conn, :current_user, user)
  end

  def call(conn, :require_authenticated_user) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_status(:unauthorized)
      |> json(%{description: "User must be authorized"})
      |> halt()
    end
  end
end

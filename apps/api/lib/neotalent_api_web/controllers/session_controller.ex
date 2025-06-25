defmodule NeotalentApiWeb.SessionController do
  use NeotalentApiWeb, :controller

  def show(conn, _params) do
    json(conn, conn.assigns.current_user)
  end

  def delete(conn, _params) do
    conn
    |> clear_session()
    |> send_resp(:ok, "")
  end
end

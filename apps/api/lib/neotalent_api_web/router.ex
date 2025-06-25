defmodule NeotalentApiWeb.Router do
  use NeotalentApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
  end

  pipeline :api_auth do
    plug :fetch_session
    plug NeotalentApiWeb.Plugs.Auth, :fetch_current_user
    plug NeotalentApiWeb.Plugs.Auth, :require_authenticated_user
  end

  scope "/api", NeotalentApiWeb do
    pipe_through :api

    post "/auth", AuthController, :create

    scope "/" do
      pipe_through :api_auth

      get "/session", SessionController, :show
      delete "/session", SessionController, :delete

      get "/chat/messages", ChatController, :index
      post "/chat/messages", ChatController, :create
    end
  end
end

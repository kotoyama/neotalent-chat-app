defmodule NeotalentApiWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :neotalent_api

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "session_id",
    signing_salt: System.get_env("SESSION_SIGNING_SALT"),
    max_age: System.get_env("SESSION_MAX_AGE") |> String.to_integer(),
    http_only: true,
    secure: Mix.env() == :prod,
    same_site: "strict",
    path: "/",
  ]

  # socket "/live", Phoenix.LiveView.Socket,
  #   websocket: [connect_info: [session: @session_options]],
  #   longpoll: [connect_info: [session: @session_options]]



  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :neotalent_api
  end

  plug CORSPlug
  plug NeotalentApiWeb.Plugs.SecureHeadersPlug

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug NeotalentApiWeb.Router
end

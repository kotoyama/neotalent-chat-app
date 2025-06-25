# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
# Load environment variables from ".env.{env}" file.
env_file = ".env.#{Mix.env()}"

if File.exists?(env_file) do
  env_file
  |> File.read!()
  |> String.split("\n", trim: true)
  |> Enum.map(&String.split(&1, "=", parts: 2))
  |> Enum.filter(fn [key, _] -> !String.starts_with?(key, "#") and key != "" end)
  |> Enum.each(fn [key, value] ->
    System.put_env(key, value)
  end)
end

import Config

config :neotalent_api,
  ecto_repos: [NeotalentApi.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

signing_salt =
  System.get_env("SESSION_SIGNING_SALT") ||
    raise """
    environment variable SESSION_SIGNING_SALT is missing.
    Please set it to a random string of at least 64 characters.
    """

config :neotalent_api, NeotalentApiWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [json: NeotalentApiWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: NeotalentApi.PubSub,
  live_view: [signing_salt: "HB+8p2kk"],
  secret_key_base: secret_key_base,
  signing_salt: signing_salt

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Configure CORS
allowed_origins =
  System.get_env("ALLOWED_ORIGINS")
  |> String.split(",")
  |> Enum.map(&String.trim/1)

config :cors_plug,
  origin: allowed_origins,
  credentials: true

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
# Configure Exq
config :exq,
  url: System.get_env("REDIS_URL") || "redis://localhost:6379",
  namespace: "neotalent_api"

import_config "#{config_env()}.exs"

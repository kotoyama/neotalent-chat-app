defmodule NeotalentApi.Repo do
  use Ecto.Repo,
    otp_app: :neotalent_api,
    adapter: Ecto.Adapters.Postgres
end

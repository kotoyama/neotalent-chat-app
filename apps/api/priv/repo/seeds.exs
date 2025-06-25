# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     NeotalentApi.Repo.insert!(%NeotalentApi.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

NeotalentApi.Accounts.register_user(%{
  email: "test@test.com",
  password: "Test1234@"
})


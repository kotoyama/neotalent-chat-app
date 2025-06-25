defmodule NeotalentApi.Chat do
  @moduledoc """
  The Chat context.
  """

  import Ecto.Query, warn: false
  alias NeotalentApi.Repo

  alias NeotalentApi.Chat.Message

  @doc """
  Fetches messages with optional pagination and sorting.

  ## Parameters
    * `:limit` - Maximum number of messages to return
    * `:sort` - Sort direction, either `:asc` or `:desc` (default: `:asc`)
    * `:after` - Return messages with ID greater than this value
  """
  def list_messages(user, params \\ %{}) do
    base_query = from(m in Message, where: m.user_id == ^user.id)

    # Parse limit parameter
    limit =
      case Map.get(params, "limit") do
        nil -> nil
        limit_str when is_binary(limit_str) ->
          case Integer.parse(limit_str) do
            {int, _} when int > 0 -> int
            _ -> nil
          end
        int when is_integer(int) and int > 0 -> int
        _ -> nil
      end

    # Parse sort direction
    sort_direction =
      case Map.get(params, "sort", "asc") do
        "desc" -> :desc
        "DESC" -> :desc
        _ -> :asc
      end

    # Apply after_id filter if provided
    query =
      case Map.get(params, "after") do
        id when is_integer(id) and id > 0 ->
          from(m in base_query, where: m.id > ^id)
        str when is_binary(str) ->
          case Integer.parse(str) do
            {int_id, _} when int_id > 0 -> from(m in base_query, where: m.id > ^int_id)
            _ -> base_query
          end
        _ ->
          base_query
      end

    # Apply sorting and limit
    query = from(m in query, order_by: [{^sort_direction, m.id}])

    if limit do
      Repo.all(from(m in query, limit: ^limit))
    else
      Repo.all(query)
    end
  end

  @doc """
  Creates a message.

  ## Examples

      iex> create_message(%{field: value})
      {:ok, %Message{}} or {:error, %Ecto.Changeset{}}

  """
  def create_message(user, attrs \\ %{}) do
    attrs = Map.put(attrs, "user_id", user.id)

    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, message} = ok ->
        # Non-blocking cache update – ignore failures
        Task.start(fn -> NeotalentApi.Cache.push_message(message) end)
        ok

      error ->
        error
    end
  end

  @doc """
  Updates message status.
  """
  def update_message_status(%Message{} = message, status) when status in [:processing, :processed, :error] do
    message
    |> Message.changeset(%{"status" => status})
    |> Repo.update()
  end

  @doc """
  Returns total count of messages for a given user.
  """
  def count_messages(user) do
    Message
    |> where([m], m.user_id == ^user.id)
    |> select([m], count(m.id))
    |> Repo.one()
  end
end

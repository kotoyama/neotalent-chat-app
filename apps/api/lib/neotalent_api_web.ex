defmodule NeotalentApiWeb do
  @moduledoc """
  The entrypoint for defining your web interface, such
  as controllers, views, and so on.
  """

  def controller do
    quote do
      use Phoenix.Controller,
        formats: [:json],
        namespace: NeotalentApiWeb

      import Plug.Conn
    end
  end

  def view do
    quote do
      use Phoenix.View,
        root: "lib/neotalent_api_web/views",
        namespace: NeotalentApiWeb
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end

defmodule NeotalentApiWeb.ChangesetJSON do
  # In Phoenix v1.7 and later, we can define a JSON view that
  # renders data structures into JSON.
  def render("error.json", %{changeset: changeset}) do
    %{fields: Ecto.Changeset.traverse_errors(changeset, &translate_error/1)}
  end

  defp translate_error({msg, opts}) do
    # You can make this translation more sophisticated as needed.
    Enum.reduce(opts, msg, fn {key, value}, acc ->
      String.replace(acc, "%{" <> to_string(key) <> "}", to_string(value))
    end)
  end
end

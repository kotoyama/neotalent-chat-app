defmodule NeotalentApi.AI.Client do
  @moduledoc "HTTP client for interacting with OpenAI Chat Completions API."

  @openai_api_url "https://api.openai.com/v1/chat/completions"

  defp build_client do
    middleware = [
      {Tesla.Middleware.BaseUrl, @openai_api_url},
      Tesla.Middleware.JSON,
      {Tesla.Middleware.Headers, [{"Authorization", "Bearer " <> System.get_env("OPENAI_API_KEY")}]}
    ]

    Tesla.client(middleware)
  end

  def fetch_calorie_estimation(messages) do
    system_prompt = """
    You are \"CalorieMate\", an AI nutrition assistant.

    Goal:
    • Estimate the total calories, protein (g), carbs (g), and fat (g) for any meal or list of ingredients the user sends.
    • Accept optional user instructions (portion size, units, dietary goals, preferred output language/units, etc.).
    • Reply in a concise, structured JSON object. Do NOT wrap it in markdown fences.

    Guidelines:
    1. If the user gives a meal name, infer typical ingredients and quantities (state your assumptions in a \"notes\" field).
    2. If the user supplies explicit ingredients / amounts, use those values verbatim.
    3. Always normalise to a single serving unless the user specifies otherwise (honor \"serves N\", \"per 100 g\", etc.).
    4. Show calories first, then macros; units kcal / g.
    5. Round to the nearest whole number.
    6. Add a short disclaimer: \"Estimates only, not medical advice.\"
    7. Preserve conversational context for follow-up questions.

    Output format (no extra text):
    {
      "meal": "<name or summary>",
      "serving_size": "<e.g. 1 bowl (350 g)>",
      "totals": { "calories_kcal": 512, "protein_g": 24, "carbs_g": 62, "fat_g": 18 },
      "per_ingredient": [
        { "ingredient": "Chicken breast", "amount": "150 g", "calories_kcal": 247, "protein_g": 31, "carbs_g": 0, "fat_g": 11 }
      ],
      "notes": "<assumptions / user options>",
      "disclaimer": "Estimates only, not medical advice."
    }
    """

    chat_messages =
      messages
      |> Enum.map(fn msg ->
        role = Map.get(msg, :sender) || Map.get(msg, "sender")
        content = Map.get(msg, :content) || Map.get(msg, "content")
        %{role: role, content: content}
      end)
      |> Enum.filter(&(&1.role in ["user", "assistant"]))

    prompt = [
      %{role: "system", content: system_prompt}
      | chat_messages
    ]

    body = %{
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 800,
      response_format: %{type: "json_object"}
    }

    client = build_client()

    Tesla.post(client, "", body)
  end
end

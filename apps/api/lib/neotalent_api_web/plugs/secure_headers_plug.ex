defmodule NeotalentApiWeb.Plugs.SecureHeadersPlug do
  import Plug.Conn

  @behaviour Plug

  @headers %{
    "x-frame-options" => "DENY",
    "x-content-type-options" => "nosniff",
    "x-xss-protection" => "1; mode=block",
    "strict-transport-security" => "max-age=31536000; includeSubDomains",
    "referrer-policy" => "strict-origin-when-cross-origin",
    "permissions-policy" => "camera=(), microphone=(), geolocation=()",
    "content-security-policy" => "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' ws: wss:"
  }

  def init(opts), do: opts

  def call(conn, _opts) do
    Enum.reduce(@headers, conn, fn {key, value}, conn ->
      put_resp_header(conn, key, value)
    end)
  end
end

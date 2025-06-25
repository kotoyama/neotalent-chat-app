# Neotalent API (Phoenix/Elixir)

## Configuration file

Please fill `.env` file with your configuration first.

## Installation & Setup

```bash
$ mix deps.get         # fetch Hex packages
$ mix ecto.create      # create DB
$ mix ecto.migrate     # run migrations
$ mix run priv/repo/seeds.exs # seed data

# Start Redis (required for Exq)
$ redis-server start

# Run Phoenix server in dev
$ MIX_ENV=dev mix phx.server

# API available at http://localhost:4000/api  from your browser.
```

## Message Processing Flow

- All endpoints require a session cookie, so user needs to authenticate first using `/api/auth` endpoint. User seed data for auth: `email="test@test.com", password="Test1234@"`.
- User POSTs a message to `/api/chat/messages` to get AI reply.
- API validates, stores it as `sender='user'` in messages, enqueues job.
- Worker pulls job, fetches last 10 messages for context using Redis cache first.
- Worker constructs prompt, calls LLM.
- Worker stores AI reply as `sender='assistant'` and then we can get updates via polling `/api/chat/messages` endpoint.

## Possible Improvements

- Cursor-based pagination for messages.
- WebSocket/SSE for real-time updates instead of polling.
- Docker for containerization.
- Swagger for API documentation.
- Rate limiting.
- Prompt enhancement?

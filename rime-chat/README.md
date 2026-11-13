# Rime chat

A standalone dark, cold-toned chat website for Rime, an original fictional AI gaming character. It is kept in its own directory inside the Fai-AI repository so it does not overwrite the existing FAI project site.

## Run locally

Requires Node.js 20.12+.

```bash
cd rime-chat
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000. The default mock provider works without a key. Configure a server-side OpenAI-compatible or Anthropic provider in `.env` to use a real model. Never commit API keys.

## Files

- `server.js`: Express API and static server
- `src/persona.js`: character profile and system prompt
- `src/chat.js`: message validation, rate limiting and distress detection
- `src/llm.js`: mock, OpenAI-compatible and Anthropic adapters
- `public/`: browser interface
- `test/`: smoke tests

Chat history is stored in the visitor's browser only. The built-in in-memory rate limiter is a basic starter measure, not production-grade protection.

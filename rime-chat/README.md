# Rime chat

A standalone dark chat website for Rime, an original fictional AI gaming character, inside the Fai-AI repository.

## Live deployment

This app is deployed separately from the repository's root FAI site. Its Vercel project uses this directory as its root.

## Run locally

Requires Node.js 20.12+.

```bash
cd rime-chat
npm install
npm start
```

Open http://localhost:3000. Without a key, the app uses demo replies. Open **API settings** to choose an OpenAI-compatible or Anthropic provider, enter a model and endpoint, and save your API key in this browser.

## API key storage

The API key is stored in this browser's localStorage only. It is not committed to GitHub or saved in a server environment/database. When you send a message, the browser sends the key over HTTPS to this app's server for that request; the server uses it in memory and does not persist or log it. Browser localStorage is not encrypted and can be read by scripts running on the same origin, so only use a trusted device and site. Clear the key from API settings when finished.

## Files

- `server.js`: Express app, local server and API routes
- `api/index.js`: Vercel serverless entry
- `vercel.json`: API routing
- `src/persona.js`: character profile and system prompt
- `src/chat.js`: message validation, rate limiting and distress detection
- `src/llm.js`: demo, OpenAI-compatible and Anthropic adapters
- `public/`: browser interface
- `test/`: smoke tests

The in-memory rate limiter is a basic starter measure, not production-grade protection.

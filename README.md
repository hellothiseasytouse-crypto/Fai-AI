# Dying Ember — GitHub-only social UI + AI

This repository runs as a **static GitHub Pages site**. It does not require Vercel, a Node server, or a backend deployment.

## Files
- `index.html` — supplied Instagram-style FAI social UI plus the Dying Ember AI panel.
- `scripts/ai.js` — browser-side Claude API client: FAI (Instagram identity), Yeagrist (Discord identity), Personality-AI, Feelings-AI, Rule-AI, and Traits-AI.
- `data/evidence-template.json` — a structure for preserving original messages and context separately from interpretations.

## Enable GitHub Pages
1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. Its URL appears on that settings page.

## Use the AI
1. Open the published site and click **✦ Dying Ember AI**.
2. Click **Key** and paste your own Anthropic API key.
3. Select FAI or Yeagrist and an AI module, then chat.

## Important security limitation
GitHub Pages serves static files only; it cannot keep a secret API key on a server or run a private API endpoint. This version sends your key **directly from your browser to Anthropic**. The key is kept in `sessionStorage` for the current tab session and is not committed to GitHub, but browser-side keys are inherently less secure. Use a key with suitable limits, never paste it into source files, and clear it with the **Key** button when finished. For a secure shared AI service, a server-side backend would be required; that is intentionally not included because this project is GitHub-only.

## Evidence and reconstruction limits
The social UI's posts, follows, messages, and media remain local to the current browser; this is a UI prototype, not a multi-user social network. The AI currently has **no curated archive of historical messages**. Add carefully reviewed source records before expecting evidence-backed reconstructions. Until then, the AI is instructed to acknowledge gaps rather than invent quotes, memories, feelings, or traits.

FAI and Yeagrist are reconstruction labels, not the actual person. Use only source material you are permitted to use, and avoid including unnecessary private information.

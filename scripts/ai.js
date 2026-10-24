/* Dying Ember AI — static GitHub Pages client. API keys are never written to disk. */
(() => {
  const $ = (id) => document.getElementById(id);
  const panel = $('ai-panel'), body = $('ai-body'), input = $('ai-input'), send = $('ai-send'), keyButton = $('ai-key');
  const HISTORY_KEY = 'dying-ember-ai-chat-v1', SESSION_KEY = 'dying-ember-anthropic-key';
  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { history = []; }
  history = Array.isArray(history) ? history.filter(m => m && ['user','assistant'].includes(m.role) && typeof m.content === 'string') : [];
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function draw() { body.innerHTML = history.map(m => `<div class="ai-msg ${m.role === 'user' ? 'me' : ''}">${escapeHtml(m.content)}</div>`).join(''); body.scrollTop = body.scrollHeight; }
  function save() { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-80))); } catch {} }
  function getKey() { try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch { return ''; } }
  function setKey() {
    const next = window.prompt('Paste your Anthropic API key for this browser tab only. It is sent directly to Anthropic and is NOT saved in GitHub. Anyone with access to this browser tab may be able to use it. Leave blank to clear the key.', getKey());
    if (next === null) return;
    try { if (next.trim()) sessionStorage.setItem(SESSION_KEY, next.trim()); else sessionStorage.removeItem(SESSION_KEY); } catch {}
    keyButton.textContent = getKey() ? 'Key ✓' : 'Key';
    keyButton.title = getKey() ? 'API key loaded for this tab. Click to change or clear.' : 'Set an API key for this tab';
  }
  const modes = {
    personality: 'PERSONALITY-AI: infer communication style and stable personality patterns only when supported by messages.',
    feelings: 'FEELINGS-AI: discuss possible emotional tone cautiously. Do not claim to know private feelings; distinguish evidence from interpretation.',
    rules: 'RULE-AI: identify demonstrated preferences, boundaries, rules, and repeated stated principles. Do not invent rules.',
    traits: 'TRAITS-AI: list possible traits with evidence and confidence. Separate direct evidence, inference, and unknowns.'
  };
  function systemPrompt(persona, mode) {
    const identity = persona === 'yeagrist' ? 'Yeagrist, the subject’s Discord name' : 'FAI, the subject’s Instagram name';
    return `You are Dying Ember, an evidence-grounded reconstruction assistant studying ${identity}. The goal is to recover the subject, not invent them. These are simulations, not the real person and not access to their private thoughts. No source-message archive has been loaded into this build yet, so do not pretend to remember specific historical messages or events. Clearly say when evidence is missing. Separate direct evidence, cautious inference, and unknowns. Preserve contradictions, context, jokes, and uncertainty; do not turn one message into a permanent personality trait. Never fabricate quotes, memories, biographical facts, feelings, or behaviours. ${modes[mode] || modes.personality} Match platform style only when actual examples support it; do not overdo slang or caricature. Be transparent and concise.`;
  }
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || send.disabled) return;
    let key = getKey();
    if (!key) { setKey(); key = getKey(); }
    if (!key) { history.push({role:'assistant',content:'No API key set. Click “Key” and add your own Anthropic key to use the AI. The social UI still works without it.'}); draw(); save(); return; }
    const persona = $('ai-persona').value, mode = $('ai-mode').value;
    input.value = ''; history.push({role:'user',content:text});
    const wait = {role:'assistant',content:'Thinking…'}; history.push(wait); draw(); save(); send.disabled = true;
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:900,system:systemPrompt(persona,mode),messages:history.filter(m=>m!==wait).slice(-20).map(({role,content})=>({role,content}))})
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error?.message || `Anthropic request failed (${response.status})`);
      wait.content = (data.content || []).filter(c=>c.type==='text').map(c=>c.text).join('\n').trim() || 'No text response returned.';
    } catch (error) {
      wait.content = `AI request failed: ${error.message}. Check that your Anthropic key is valid and has API access. Your key is not stored in this repository.`;
    } finally { send.disabled = false; draw(); save(); }
  }
  $('ai-launch').addEventListener('click',()=>panel.classList.toggle('on'));
  $('ai-close').addEventListener('click',()=>panel.classList.remove('on'));
  keyButton.addEventListener('click',setKey); send.addEventListener('click',sendMessage);
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
  keyButton.textContent = getKey() ? 'Key ✓' : 'Key'; draw();
})();

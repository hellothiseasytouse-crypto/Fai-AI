/* Dying Ember AI — embedded in the Messages conversation; API key stays in sessionStorage. */
(() => {
  const HISTORY_KEY='dying-ember-ai-chat-v2', SESSION_KEY='dying-ember-anthropic-key';
  let history=[];
  try{history=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}catch{}
  if(!Array.isArray(history))history=[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getKey=()=>{try{return sessionStorage.getItem(SESSION_KEY)||''}catch{return ''}};
  function save(){try{localStorage.setItem(HISTORY_KEY,JSON.stringify(history.slice(-80)))}catch{}}
  function draw(){const body=document.getElementById('ai-body');if(!body)return;body.innerHTML=history.map(m=>'<div class="ai-msg '+(m.role==='user'?'me':'')+'">'+esc(m.content)+'</div>').join('')||'<div class="ai-msg">This is an evidence-based reconstruction assistant, not the real person. No source archive has been loaded yet.</div>';body.scrollTop=body.scrollHeight;const k=document.getElementById('ai-key');if(k)k.textContent=getKey()?'Key ✓':'Key';}
  function setKey(){const next=window.prompt('Paste your Anthropic API key for this browser tab only. It is sent directly to Anthropic and is not saved in GitHub. Leave blank to clear it.',getKey());if(next===null)return;try{if(next.trim())sessionStorage.setItem(SESSION_KEY,next.trim());else sessionStorage.removeItem(SESSION_KEY)}catch{}draw()}
  const modes={
    personality:'PERSONALITY-AI: infer communication style and stable personality patterns only when supported by messages.',
    feelings:'FEELINGS-AI: discuss possible emotional tone cautiously. Do not claim to know private feelings; distinguish evidence from interpretation.',
    rules:'RULE-AI: identify demonstrated preferences, boundaries, rules, and repeated stated principles. Do not invent rules.',
    traits:'TRAITS-AI: list possible traits with evidence and confidence. Separate direct evidence, inference, and unknowns.'
  };
  async function sendMessage(){
    const input=document.getElementById('ai-input'),send=document.getElementById('ai-send');if(!input||!send)return;
    const text=input.value.trim();if(!text||send.disabled)return;
    let key=getKey();if(!key){setKey();key=getKey()}if(!key)return;
    const persona=document.getElementById('ai-persona')?.value||'fai',mode=document.getElementById('ai-mode')?.value||'personality';
    const identity=persona==='yeagrist'?'Yeagrist, the subject’s Discord name':'FAI, the subject’s Instagram name';
    const system='You are Dying Ember, an evidence-grounded reconstruction assistant studying '+identity+'. These are simulations, not the real person. No source-message archive has been loaded into this build yet, so do not pretend to remember historical messages. Clearly say when evidence is missing. Separate direct evidence, cautious inference, and unknowns. Preserve contradictions and context; never fabricate quotes, memories, biography, feelings, or behaviours. '+(modes[mode]||modes.personality);
    input.value='';history.push({role:'user',content:text});history.push({role:'assistant',content:'Thinking…'});const wait=history[history.length-1];draw();send.disabled=true;
    try{
      const response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:900,system,messages:history.slice(0,-1).slice(-20).map(({role,content})=>({role,content}))})});
      const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error?.message||'Anthropic request failed ('+response.status+')');
      wait.content=(data.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n').trim()||'No text response returned.';
    }catch(error){wait.content='AI request failed: '+error.message+'. Check that your Anthropic key is valid and has API access.'}
    finally{send.disabled=false;save();draw()}
  }
  document.addEventListener('click',e=>{if(e.target.closest('#ai-key'))setKey();if(e.target.closest('#ai-send'))sendMessage()});
  document.addEventListener('keydown',e=>{if(e.target?.id==='ai-input'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}});
  document.addEventListener('change',e=>{if(e.target?.id==='ai-persona'||e.target?.id==='ai-mode'){}});
  document.addEventListener('click',e=>{if(e.target.closest('[data-a="chat"]')?.dataset.id==='fai.reconstruction')setTimeout(draw,0)});
})();

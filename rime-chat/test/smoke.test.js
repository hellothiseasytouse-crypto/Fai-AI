const test=require('node:test');const assert=require('node:assert/strict');const {normalizeMessages,looksDistressed,HttpError}=require('../src/chat');const {generateReply}=require('../src/llm');const {PERSONA}=require('../src/persona');
test('normalizes chat and caps content',()=>{const out=normalizeMessages([{role:'assistant',content:'yo'},{role:'user',content:' hi '},{role:'system',content:'ignored'},{role:'user',content:'x'.repeat(5000)}]);assert.equal(out[0].content,'hi');assert.equal(out.at(-1).content.length,1000)});
test('rejects invalid messages',()=>{assert.throws(()=>normalizeMessages('no'),HttpError);assert.throws(()=>normalizeMessages([]),HttpError)});
test('flags distress language but not gaming talk',()=>{assert.equal(looksDistressed('i feel so lonely'),true);assert.equal(looksDistressed('tsb is depressing lol'),false)});
test('mock provider returns a short reply',async()=>{process.env.LLM_PROVIDER='mock';const reply=await generateReply({messages:[{role:'user',content:'hi'}]});assert.ok(reply.length>0&&reply.length<300)});
test('persona is transparent about being an AI',()=>assert.match(PERSONA.systemPrompt,/AI character/));

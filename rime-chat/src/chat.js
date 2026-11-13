const MAX_MESSAGES=20, MAX_CHARS=1000;
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
function normalizeMessages(input){
 if(!Array.isArray(input)) throw new HttpError(400,'messages must be an array');
 const msgs=input.slice(-100).filter(m=>m&&(m.role==='user'||m.role==='assistant')&&typeof m.content==='string')
  .map(m=>({role:m.role,content:m.content.trim().slice(0,MAX_CHARS)})).filter(m=>m.content).slice(-MAX_MESSAGES);
 while(msgs.length&&msgs[0].role!=='user') msgs.shift();
 if(!msgs.length||msgs.at(-1).role!=='user') throw new HttpError(400,'last message must come from the user');
 return msgs;
}
const DISTRESS_PATTERNS=[/\b(kill|hurt|harm)\s+(my\s?self|myself)\b/i,/\bsuicid/i,/\bwant(ed)?\s+to\s+die\b/i,/\bself[\s-]?harm/i,/\bno\s+one\s+(cares|likes\s+me)\b/i,/\b(lonely|alone|worthless|hopeless|depressed)\b/i];
function looksDistressed(text){return DISTRESS_PATTERNS.some(re=>re.test(text));}
function makeRateLimiter({windowMs=60000,max=20}={}){
 const hits=new Map(); const timer=setInterval(()=>{const now=Date.now();for(const [k,v] of hits)if(now-v.start>=windowMs)hits.delete(k);},windowMs);timer.unref();
 return (req,res,next)=>{const key=req.ip||'unknown',now=Date.now();let e=hits.get(key);if(!e||now-e.start>=windowMs){e={start:now,count:0};hits.set(key,e);}if(++e.count>max){res.set('Retry-After',String(Math.ceil((e.start+windowMs-now)/1000)));return res.status(429).json({error:'slow down a bit'});}next();};
}
module.exports={HttpError,normalizeMessages,looksDistressed,makeRateLimiter,MAX_MESSAGES,MAX_CHARS};

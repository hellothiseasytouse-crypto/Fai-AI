try{process.loadEnvFile();}catch{}
const path=require('path'),express=require('express');
const {PERSONA}=require('./src/persona');
const {normalizeMessages,looksDistressed,makeRateLimiter}=require('./src/chat');
const {generateReply,providerName}=require('./src/llm');
const app=express(),PORT=Number(process.env.PORT)||3000;
app.disable('x-powered-by');app.use(express.json({limit:'32kb'}));app.use(express.static(path.join(__dirname,'public')));
app.get('/api/config',(req,res)=>res.json({name:PERSONA.name,tagline:PERSONA.tagline,description:PERSONA.description,greeting:PERSONA.greeting,demo:providerName()==='mock'}));
const limiter=makeRateLimiter({windowMs:60000,max:Number(process.env.RATE_LIMIT_PER_MIN)||20});
app.post('/api/chat',limiter,async(req,res,next)=>{try{const messages=normalizeMessages(req.body?.messages),distress=looksDistressed(messages.at(-1).content),reply=await generateReply({messages,distress});res.json({reply});}catch(err){next(err);}});
app.use('/api',(req,res)=>res.status(404).json({error:'not found'}));
app.use((err,req,res,next)=>{const status=err.status||err.statusCode||500;if(status>=500&&!err.status)console.error(err);res.status(status).json({error:status>=500&&!err.status?'something broke on the server':err.message});});
app.listen(PORT,()=>console.log(PERSONA.name+' is up on http://localhost:'+PORT+' (provider: '+providerName()+')'));

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_ORIGIN || 'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
const port=Number(process.env.PORT||4000);
const configured=Boolean(process.env.DATABASE_URL);
const pool=configured?new pg.Pool({connectionString:process.env.DATABASE_URL,max:2,connectionTimeoutMillis:12000,idleTimeoutMillis:10000}):null;
const secret=process.env.JWT_SECRET;
const issue=(u)=>jwt.sign({sub:u.id,role:u.role},secret,{expiresIn:'12h'});
const safeUser=(u)=>({id:u.id,name:u.name,email:u.email,role:u.role,specialty:u.specialty,hospital:u.hospital,license:u.license});
function fail(res,e){console.error(e);res.status(e.status||500).json({error:e.status?e.message:'Request failed. Check server logs.'});}
function ensure(req,res,next){if(!pool)return res.status(503).json({error:'Neon is not configured. Add DATABASE_URL to .env.'}); if(!secret||secret.length<32)return res.status(503).json({error:'Set a strong JWT_SECRET in .env.'});next();}
async function auth(req,res,next){try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');const v=jwt.verify(token,secret);const {rows}=await pool.query('SELECT id,name,email,role,specialty,hospital,license FROM ca_users WHERE id=$1',[v.sub]);if(!rows[0])return res.status(401).json({error:'Unauthorized'});req.user=rows[0];next();}catch{return res.status(401).json({error:'Session expired. Sign in again.'});}}
const validate=(v,max=200)=>typeof v==='string' && v.trim().length>0&&v.length<=max;
app.get('/api/health',async(req,res)=>{let database='not configured';if(pool){try{await pool.query('SELECT 1');database='connected';}catch{database='unreachable';}}res.json({status:'ok',database,modelConfigured:Boolean(process.env.MEDGEMMA_API_URL),model:process.env.MEDGEMMA_MODEL||'google/medgemma-27b-text-it'});});
app.use('/api',ensure);
async function init(){await pool.query(`
CREATE TABLE IF NOT EXISTS ca_users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'doctor' CHECK(role IN('doctor','admin')),
 specialty TEXT DEFAULT 'Cardiology',hospital TEXT DEFAULT '',license TEXT DEFAULT '',created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ca_patients (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), doctor_id UUID NOT NULL REFERENCES ca_users(id),
 name TEXT NOT NULL,age INTEGER CHECK(age BETWEEN 0 AND 125),sex TEXT DEFAULT 'Not specified',
 phone TEXT DEFAULT '',notes TEXT DEFAULT '',created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ca_consultations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),patient_id UUID NOT NULL REFERENCES ca_patients(id) ON DELETE CASCADE,
 doctor_id UUID NOT NULL REFERENCES ca_users(id),title TEXT NOT NULL DEFAULT 'Cardiac consultation',status TEXT NOT NULL DEFAULT 'Open',
 created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS ca_messages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),consultation_id UUID NOT NULL REFERENCES ca_consultations(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK(role IN('user','assistant')),content TEXT NOT NULL,model TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS ca_patients_doctor_idx ON ca_patients(doctor_id);
CREATE INDEX IF NOT EXISTS ca_consultations_doctor_idx ON ca_consultations(doctor_id);
CREATE INDEX IF NOT EXISTS ca_messages_consult_idx ON ca_messages(consultation_id,created_at);
`);}
// Schema setup runs once per warm serverless instance before data routes.
// CREATE TABLE IF NOT EXISTS makes concurrent cold-start initialization safe.
let initPromise;
async function ready(req,res,next){
  if (!pool) return res.status(503).json({error:'DATABASE_URL is missing in Vercel environment variables.'});
  try { if (!initPromise) initPromise=init().catch(e=>{initPromise=null;throw e}); await initPromise; next(); }
  catch(e){console.error('Database schema initialization failed:',e);res.status(503).json({error:'Database is unavailable or needs initialization. Check Vercel function logs.'});}
}
app.use('/api',ready);
app.post('/api/auth/register',async(req,res)=>{try{const {name,email,password,specialty,hospital,license}=req.body;if(!validate(name,120)||!validate(email,180)||!validate(password,150)||password.length<10)return res.status(400).json({error:'Name, email and password of 10+ characters are required.'});const hash=await bcrypt.hash(password,12);const {rows}=await pool.query('INSERT INTO ca_users (name,email,password_hash,specialty,hospital,license) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[name.trim(),email.trim().toLowerCase(),hash,specialty||'Cardiology',hospital||'',license||'']);res.status(201).json({user:safeUser(rows[0]),token:issue(rows[0])});}catch(e){if(e.code==='23505')return res.status(409).json({error:'Email already registered.'});fail(res,e);}});
app.post('/api/auth/login',async(req,res)=>{try{const {email,password}=req.body;const {rows}=await pool.query('SELECT * FROM ca_users WHERE email=$1',[String(email||'').trim().toLowerCase()]);const u=rows[0];if(!u||!await bcrypt.compare(String(password||''),u.password_hash))return res.status(401).json({error:'Invalid email or password.'});res.json({user:safeUser(u),token:issue(u)});}catch(e){fail(res,e);}});
app.get('/api/me',auth,(req,res)=>res.json(req.user));
app.get('/api/stats',auth,async(req,res)=>{try{const [patients,consultations,ai]=await Promise.all([pool.query('SELECT COUNT(*)::int AS n FROM ca_patients WHERE doctor_id=$1',[req.user.id]),pool.query('SELECT COUNT(*)::int AS n FROM ca_consultations WHERE doctor_id=$1',[req.user.id]),pool.query("SELECT COUNT(*)::int AS n FROM ca_messages m JOIN ca_consultations c ON c.id=m.consultation_id WHERE c.doctor_id=$1 AND m.role='assistant'",[req.user.id])]);res.json({patients:patients.rows[0].n,consultations:consultations.rows[0].n,ai:ai.rows[0].n});}catch(e){fail(res,e);}});
app.get('/api/patients',auth,async(req,res)=>{try{const {rows}=await pool.query('SELECT * FROM ca_patients WHERE doctor_id=$1 ORDER BY created_at DESC',[req.user.id]);res.json(rows);}catch(e){fail(res,e);}});
app.post('/api/patients',auth,async(req,res)=>{try{const {name,age,sex,phone,notes}=req.body;if(!validate(name,160))return res.status(400).json({error:'Patient name required.'});const {rows}=await pool.query('INSERT INTO ca_patients (doctor_id,name,age,sex,phone,notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',[req.user.id,name.trim(),age===''||age==null?null:Number(age),sex||'Not specified',phone||'',notes||'']);res.status(201).json(rows[0]);}catch(e){fail(res,e);}});
app.get('/api/consultations',auth,async(req,res)=>{try{const {rows}=await pool.query('SELECT c.*,p.name AS patient_name FROM ca_consultations c JOIN ca_patients p ON p.id=c.patient_id WHERE c.doctor_id=$1 ORDER BY c.created_at DESC',[req.user.id]);res.json(rows);}catch(e){fail(res,e);}});
app.post('/api/consultations',auth,async(req,res)=>{try{const {patientId,title}=req.body;const own=await pool.query('SELECT id FROM ca_patients WHERE id=$1 AND doctor_id=$2',[patientId,req.user.id]);if(!own.rows[0])return res.status(404).json({error:'Patient not found.'});const {rows}=await pool.query('INSERT INTO ca_consultations (doctor_id,patient_id,title) VALUES ($1,$2,$3) RETURNING *',[req.user.id,patientId,String(title||'Cardiac consultation').slice(0,180)]);res.status(201).json(rows[0]);}catch(e){fail(res,e);}});
app.get('/api/consultations/:id/messages',auth,async(req,res)=>{try{const {rows}=await pool.query('SELECT m.* FROM ca_messages m JOIN ca_consultations c ON c.id=m.consultation_id WHERE c.id=$1 AND c.doctor_id=$2 ORDER BY m.created_at ASC,m.id ASC',[req.params.id,req.user.id]);res.json(rows);}catch(e){fail(res,e);}});
const systemPrompt=`You are MedGemma used solely as a clinical decision-support drafting assistant for licensed clinicians. Keep responses grounded in supplied patient history and reported facts; distinguish observations, differential considerations, uncertainties, and suggested verification. Do not claim that ECG, echo or other images were reviewed when none were supplied. Flag possible medical emergencies for immediate clinical assessment. Never make definitive diagnoses or autonomous treatment decisions. Do not invent test results or citations. Recommend clinician verification using current local protocols. Be concise.`;
async function inference(text,history){const base=process.env.MEDGEMMA_API_URL?.replace(/\/$/,'');if(!base){const e=new Error('MedGemma inference is not configured. Set MEDGEMMA_API_URL and MEDGEMMA_MODEL in .env.');e.status=503;throw e;}const url=base.endsWith('/chat/completions')?base:base.endsWith('/v1')?base+'/chat/completions':base+'/v1/chat/completions';const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),90000);try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.MEDGEMMA_API_KEY?{'Authorization':`Bearer ${process.env.MEDGEMMA_API_KEY}`}:{})},body:JSON.stringify({model:process.env.MEDGEMMA_MODEL||'google/medgemma-27b-text-it',messages:[{role:'system',content:systemPrompt},...history.slice(-8).map(x=>({role:x.role,content:x.content})),{role:'user',content:text}],temperature:0.2,max_tokens:750}),signal:controller.signal});if(!r.ok){const e=new Error(`MedGemma provider returned ${r.status}. Check your model deployment.`);e.status=502;throw e;}const data=await r.json();const out=data.choices?.[0]?.message?.content;if(!out||typeof out!=='string')throw new Error('MedGemma returned no readable text.');return out;}finally{clearTimeout(timer);}}
app.post('/api/consultations/:id/message',auth,async(req,res)=>{try{const content=String(req.body.content||'').trim();if(!content||content.length>6000)return res.status(400).json({error:'Message must be 1–6000 characters.'});const own=await pool.query('SELECT c.id,p.name,p.age,p.sex,p.notes FROM ca_consultations c JOIN ca_patients p ON p.id=c.patient_id WHERE c.id=$1 AND c.doctor_id=$2',[req.params.id,req.user.id]);if(!own.rows[0])return res.status(404).json({error:'Consultation not found.'});if(!process.env.MEDGEMMA_API_URL)return res.status(503).json({error:'MedGemma is not connected. Configure the model endpoint before sending clinical questions.'});const history=(await pool.query('SELECT role,content FROM ca_messages WHERE consultation_id=$1 ORDER BY created_at DESC LIMIT 8',[req.params.id])).rows.reverse();const p=own.rows[0];const context=`Patient: ${p.name}; age ${p.age??'unknown'}; sex ${p.sex}; notes: ${p.notes||'not provided'}.\nClinical question: ${content}`;const answer=await inference(context,history);await pool.query('INSERT INTO ca_messages (consultation_id,role,content) VALUES ($1,$2,$3)',[req.params.id,'user',content]);await pool.query('INSERT INTO ca_messages (consultation_id,role,content,model) VALUES ($1,$2,$3,$4)',[req.params.id,'assistant',answer,process.env.MEDGEMMA_MODEL||'google/medgemma-27b-text-it']);res.json({answer,model:process.env.MEDGEMMA_MODEL||'google/medgemma-27b-text-it'});}catch(e){fail(res,e);}});
app.get('/api/reports/export',auth,async(req,res)=>{try{const {rows}=await pool.query('SELECT p.name AS patient,c.title,c.status,c.created_at,m.role,m.content,m.created_at AS message_at FROM ca_consultations c JOIN ca_patients p ON p.id=c.patient_id LEFT JOIN ca_messages m ON m.consultation_id=c.id WHERE c.doctor_id=$1 ORDER BY c.created_at DESC,m.created_at ASC',[req.user.id]);res.setHeader('Content-Type','application/json');res.setHeader('Content-Disposition','attachment; filename="cardioassist-reports.json"');res.json(rows);}catch(e){fail(res,e);}});
// On Vercel, the exported Express app is invoked as a serverless function.
// The local development entrypoint uses the same app and API routes.
if (process.env.VERCEL !== '1') {
  app.listen(port,async()=>{
    console.log(`CardioAssist API listening on http://localhost:${port}`);
    if(!pool) return console.warn('DATABASE_URL missing: database routes disabled.');
    try { if (!initPromise) initPromise=init(); await initPromise; console.log('Neon connection succeeded; CardioAssist tables ready.'); }
    catch(e){console.error('Database initialization failed:',e.message); initPromise=null;}
  });
}
export default app;

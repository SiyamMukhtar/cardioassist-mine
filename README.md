# CardioAssist — React + Neon + MedGemma-ready backend

## What is included
- Responsive React clinical workspace based on the supplied CardioAssist HTML, with a 22:9 wide-screen-friendly page layout.
- Original supplied design preserved at `public/reference.html` for side-by-side reference (this legacy page is not linked to the new database and contains its original demo localStorage features).
- Doctor sign-up and login (passwords hashed, JWT sessions); patient records, consultations, message history, reports export.
- Express backend connected to Neon PostgreSQL; tables use `ca_` prefix to avoid touching unrelated tables.
- MedGemma **only** inference adapter using an OpenAI-compatible serving endpoint. No fallback to NCD Gemma or a non-MedGemma model.

## Installation on Windows (from your existing React project folder)
1. **Back up your existing folder**, and extract this ZIP into `C:\Users\HAMZA\cardioassist`, replacing matching scaffold files. Do not delete `.git`.
2. Open CMD:
   ```cmd
   cd C:\Users\HAMZA\cardioassist
   copy .env.example .env
   notepad .env
   ```
3. Put your **existing Neon PostgreSQL URL** into `DATABASE_URL` in `.env` and generate a random `JWT_SECRET` of 32+ characters. **Do not put the database URL in React source files.**
4. Install and start:
   ```cmd
   npm install
   npm run dev:all
   ```
5. Open `http://localhost:5173`. Register a doctor. Tables are created automatically if the Neon role has CREATE permission.

### AI integration
The UI deliberately shows **MedGemma not connected** until you deploy/configure an inference service. A model identifier alone does not load model weights or start a GPU server.

- Choose `google/medgemma-27b-text-it` for text-only (needs substantial GPU RAM), or `google/medgemma-1.5-4b-it` for future multimodal work.
- Accept the model's relevant license terms and provision inference independently.
- For example, serve MedGemma with vLLM using its OpenAI-compatible endpoint, then set `MEDGEMMA_API_URL=http://localhost:8000/v1` (adjust for where the server actually runs). Set `MEDGEMMA_MODEL` to the actual served model name.
- The included chat UI is **text-only**. Medical image input, ECG signal handling, and separate validation for each modality are not implemented. The original HTML can visually mention these but that does not constitute actual AI support.
- Do not send real patient data to an inference provider without evaluating authorization, consent, processing terms, and security controls.

### Data migration and existing database
This package **does not overwrite, delete, or migrate any pre-existing Neon rows**. The supplied HTML stores its demo information in the browser's `localStorage` under `cardioassist_v3`, not in a server database. Export that original data separately before removing the old browser origin. A separate migration/import procedure will be needed to transfer existing users/patients/consultations from an actual source database (no source dump was provided). The Neon connection itself is never run from the browser.

### Security / clinical limitations
- Clinical support prototype, **not a validated medical device**. Outputs are advisory and require clinician review.
- Registration is self-service in this initial prototype; add clinician-license verification, organizational tenancy, stricter RBAC, audit logging, CSRF/cookie hardening, consent, retention policies, backups, and encryption/privacy review before real patient use.
- Existing demo HTML contains a local test admin login; it is *not* the login for this new application.
- Database connection and AI credentials belong only in untracked `.env` or a production secrets manager.

## Push update
```cmd
git add .
git commit -m "Build CardioAssist React and Neon backend"
git push origin main
```

## Check connection
`http://localhost:4000/api/health` returns JSON including `database` and `modelConfigured`. Avoid treating an unconfigured model as a successful AI deployment.


## Vercel (live frontend + Neon backend)
This version includes `api/index.js` and `vercel.json`: both the React UI and `/api` backend deploy on the same Vercel domain. No public database connection string is placed into the frontend.

1. Extract ZIP into the existing local `cardioassist` folder (retain `.git` and your local `.env`).
2. Run `npm install` and `npm run build`. Run `npm run dev:all` to test locally.
3. In Vercel select **Add New > Project**, import `hamzawasiq79-lang/cardioassist`, set Framework Preset **Vite**, Root Directory `./`, Build Command `npm run build`, Output Directory `dist`.
4. **Before deployment**, set **Project > Settings > Environment Variables** for **Production**:
   - `DATABASE_URL` = your full original Neon URL, exactly as saved in your local `.env`
   - `JWT_SECRET` = secure random string (32+ characters). You may choose a different one from local; existing browser sessions may need to log in again.
   - `MEDGEMMA_MODEL` = `google/medgemma-27b-text-it`
   - `MEDGEMMA_API_URL` and `MEDGEMMA_API_KEY` only if a real MedGemma server is available.
   - `CLIENT_ORIGIN` is not necessary for same-origin calls on Vercel (the app's API is on the same domain).
5. Push `main` with `git add . && git commit -m "Make CardioAssist Vercel ready" && git push origin main` and Vercel will deploy from GitHub.
6. Open `https://YOUR-VERCEL-DOMAIN/api/health`; confirm `database: connected`. Then test login, patient creation, etc.
7. Any future push to `main` automatically triggers a new production deployment. Preview branches create preview deployments.

**IMPORTANT:** Existing Neon `ca_` tables are reused; the backend only uses `CREATE TABLE IF NOT EXISTS` and indexes. MedGemma is not automatically hosted on Vercel. Do not use real patient data in this public prototype without production-grade security, identity checks and privacy review.

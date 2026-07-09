# RoleLens

AI-powered resume screening and job role recommendation platform. Upload a resume, get an
AI-scored breakdown of best-fit roles, a skill-gap analysis, and a career roadmap.

This repository contains two independently deployable apps and a database schema:

```
rolelens/
├── frontend/    React 19 + Vite + TypeScript + Tailwind CSS  (deploy to Vercel)
├── backend/     Node.js + Express + TypeScript                (deploy to Render)
└── database/    Supabase (PostgreSQL) schema + RLS policies
```

## 1. Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is enough to start)
- A [Google Gemini API key](https://ai.google.dev/)

## 2. Set up Supabase

1. Create a new Supabase project.
2. Open the SQL editor and run `database/schema.sql`. This creates all tables, indexes,
   row-level security policies, and the private `resumes` storage bucket.
3. From **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (backend only — never expose this to the frontend)

## 3. Backend setup

```bash
cd backend
cp .env.example .env   # fill in SUPABASE_*, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev             # starts on http://localhost:5000
```

Key implementation notes:

- Auth is custom (bcrypt + JWT) against the `profiles` table, so the frontend never needs the
  Supabase client for login/register. All API writes to Supabase go through the **service role**
  key, and every query is manually scoped by `user_id`.
- Resume files are parsed in-memory (`pdf-parse` for PDF, `mammoth` for DOCX), then uploaded to
  the private `resumes` Supabase Storage bucket under `{userId}/{uuid}.{ext}`.
- `POST /api/resume/analyze` sends the parsed resume text to Gemini using the prompt in
  `src/prompts/analysisPrompt.ts`, which forces a strict JSON schema (see `AI PROMPT` below).
  The response is validated before being persisted across `resume_analysis` and
  `recommended_roles`.
- Rate limiting is applied globally and more tightly on `/auth/*` and `/resume/analyze`.

### API endpoints

| Method | Path                    | Auth | Description                              |
|--------|-------------------------|------|------------------------------------------|
| POST   | `/api/auth/register`    | No   | Create an account                        |
| POST   | `/api/auth/login`       | No   | Log in, returns JWT                      |
| GET    | `/api/auth/profile`     | Yes  | Current user profile                     |
| POST   | `/api/resume/upload`    | Yes  | Upload + parse a resume (multipart)      |
| POST   | `/api/resume/analyze`   | Yes  | Run Gemini analysis, persist results     |
| GET    | `/api/analysis/history` | Yes  | List past analyses                       |
| GET    | `/api/analysis/:id`     | Yes  | Full analysis detail                     |
| DELETE | `/api/analysis/:id`     | Yes  | Delete an analysis                       |
| GET    | `/api/dashboard`        | Yes  | Summary cards for the dashboard          |

## 4. Frontend setup

```bash
cd frontend
cp .env.example .env   # set VITE_API_URL to your backend URL
npm install
npm run dev             # starts on http://localhost:5173
```

The frontend is a token-based SPA: `AuthContext` stores the JWT and user in `localStorage`,
`axios` attaches it as a `Bearer` token, and `ProtectedRoute` guards everything under
`/dashboard`. `VITE_SUPABASE_*` variables are included for future direct-to-Supabase features
(e.g. Google OAuth) but are not required for the current auth flow.

## 5. Deployment

- **Frontend → Vercel**: import `frontend/`, set the `VITE_*` env vars, build command
  `npm run build`, output directory `dist`.
- **Backend → Render**: import `backend/`, set all `.env.example` vars, build command
  `npm run build`, start command `npm start`.
- **Database → Supabase**: already hosted once you ran `schema.sql`.

Remember to update `CLIENT_URL` on the backend and `VITE_API_URL` on the frontend once both are
deployed, so CORS and API calls resolve correctly.

## 6. AI prompt contract

Gemini is instructed to return only JSON matching this shape:

```json
{
  "resumeScore": 90,
  "atsScore": 88,
  "recommendedRoles": [
    { "role": "Backend Developer", "match": 94, "confidence": "High", "reason": "..." }
  ],
  "skills": { "current": ["Java", "SQL"], "missing": ["Docker", "AWS"] },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "careerRoadmap": ["..."]
}
```

`src/services/gemini.service.ts` strips any accidental code fences and validates the shape
before it is ever persisted or returned to the client.

## 7. What's scaffolded vs. what to extend

This is a complete, running full-stack skeleton with real auth, real file parsing, a real
Gemini integration, and a persisted history — not a static mockup. A few things are marked as
extension points rather than fully built out, so you can wire them to your exact product
decisions:

- **Google login** — the UI has a slot for it; add Supabase Auth's OAuth flow or your own
  provider on top of the existing JWT session.
- **Forgot password** — the frontend page is built; connect it to Supabase Auth's
  `resetPasswordForEmail` or a custom email-sending endpoint.
- **Skill-gap "recommended" and "priority" fields** — Gemini currently returns `current` and
  `missing` skills; extend the prompt schema if you want a third "recommended" bucket with
  explicit priority ranking.
- **PDF export of reports** — the Report page currently uses the browser's native
  print-to-PDF (`window.print()`); swap in a server-rendered PDF if you need pixel-perfect
  branded exports.

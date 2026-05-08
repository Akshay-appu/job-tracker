# Trace — Job Tracker Frontend

> A premium, AI-powered frontend for the [job-tracker](https://github.com/srinivasmohan20003/job-tracker)
> Spring Boot backend. Built with React 18 + Vite + TypeScript + Tailwind + Framer Motion.

---

## Features

- **Dashboard** — live stat counters, activity timeline, pie chart, area chart
- **Applications** — CRUD with card or table view, filters, sort, debounced search
- **Resumes** — drag-and-drop upload with real-time progress bar
- **AI Analyzer** — match a resume × job application, shows score gauge, matched/missing keywords, suggestions
- **Auth** — JWT login/register with automatic token refresh, session persistence
- **Theming** — light / dark / system with instant toggle

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3, CSS variables |
| Routing | React Router DOM v6 |
| HTTP | Axios with interceptor-based token refresh |
| Animation | Framer Motion v11 |
| Charts | Recharts v2 |
| Forms | React Hook Form v7 |
| Icons | Lucide React |
| Toast | React Hot Toast |

---

## Prerequisites

- Node.js ≥ 18
- The Spring Boot backend running locally on **port 8080**
  (`docker compose up` from the repo root starts it automatically)

---

## Quick Start

```bash
# 1. Clone your repo and replace the frontend
git clone https://github.com/srinivasmohan20003/job-tracker.git
cd job-tracker

# 2. Replace config files and src/ with the new frontend
#    (see "Replacing the existing frontend" below)

# 3. Install dependencies
npm install

# 4. Start the backend
docker compose up -d db   # starts MySQL only, if preferred
# OR
docker compose up -d      # starts everything

# 5. Run the dev server
npm run dev
# → http://localhost:5173 (proxies /api → http://localhost:8080)
```

---

## Replacing the Existing Frontend

The original repo ships a plain JS frontend. Replace it entirely:

```
# Files to replace in the repo root
package.json
index.html
vite.config.ts   ← (was .js)
tailwind.config.js
postcss.config.js
tsconfig.json    ← new
tsconfig.node.json ← new
.env.example     ← new

# Replace the entire src/ directory
rm -rf src/
cp -r <path-to-this-frontend>/src .
```

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | API base. Change to `https://your-backend.com/api` in prod. |
| `VITE_BACKEND_URL` | `http://localhost:8080` | Vite proxy target (dev only). |

The Vite dev server proxy rewrites `/api/*` → `http://localhost:8080/api/*` so you never hit CORS during development.

---

## Integration Notes

### If field names don't match

All backend ↔ frontend type contracts live in **`src/types/`** — a single source of truth.

| Mismatch | File to edit |
|---|---|
| Login uses `username` not `email` | `src/types/auth.ts` → `LoginRequest.email` |
| Applied date field is `appliedAt` | `src/types/application.ts` → `applicationDate` |
| Stats keys are lowercase | `src/services/applicationService.ts` → `normalizeStats()` already handles both |
| Token key is `token` not `accessToken` | `src/services/authService.ts` → `normalizeAuthResponse()` |
| `ApplicationStatus` values differ | `src/types/application.ts` → `APPLICATION_STATUSES` + `src/utils/constants.ts` → `STATUS_META` |

### localStorage keys

| Key | Content |
|---|---|
| `trace.accessToken` | JWT access token |
| `trace.refreshToken` | JWT refresh token |
| `trace.user` | Serialized `User` object |
| `trace.theme` | `"light"` \| `"dark"` \| `"system"` |

---

## Project Structure

```
src/
├── App.tsx                  # Provider tree: Auth > Theme > Router
├── main.tsx                 # createRoot entry point
├── index.css                # Tailwind directives + CSS design tokens
│
├── context/
│   ├── AuthContext.tsx       # Session state, login/register/logout
│   └── ThemeContext.tsx      # light/dark/system, DOM sync
│
├── hooks/
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── routes/
│   ├── AppRoutes.tsx         # Full <Routes> tree
│   ├── ProtectedRoute.tsx    # Redirects unauthenticated to /login
│   └── PublicRoute.tsx       # Redirects authenticated to /dashboard
│
├── layouts/
│   ├── AppLayout.tsx         # Sidebar + Topbar + <Outlet>
│   └── AuthLayout.tsx        # Split-screen brand panel + form
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ApplicationsPage.tsx
│   ├── ResumesPage.tsx
│   ├── AnalyzerPage.tsx
│   ├── ProfilePage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
│
├── components/
│   ├── ui/                   # Button, Input, Select, Textarea, Card,
│   │                         #  Modal, Spinner, Skeleton, EmptyState,
│   │                         #  Avatar, Logo
│   ├── layout/               # Sidebar, Topbar, MobileNav, PageHeader
│   ├── dashboard/            # StatCard, WelcomeWidget, charts, feeds
│   ├── applications/         # Card, Table, Form, DetailModal, Filters, StatusBadge
│   └── resumes/              # Uploader, ResumeCard, MatchScore, SkillsCloud, AnalysisPanel
│
├── services/
│   ├── api.ts                # Axios instance + interceptors + extractErrorMessage
│   ├── authService.ts        # login, register, logout, hydrate, refresh
│   ├── applicationService.ts # CRUD + stats + normalizeStats()
│   └── resumeService.ts      # list, upload, remove, analyze
│
├── types/
│   ├── common.ts             # PaginatedResponse<T>
│   ├── auth.ts               # User, LoginRequest, RegisterRequest, AuthSession
│   ├── application.ts        # JobApplication, JobApplicationInput, ApplicationStats
│   ├── resume.ts             # Resume, ResumeAnalysis
│   └── index.ts              # Re-exports
│
└── utils/
    ├── cn.ts                 # clsx + tailwind-merge helper
    ├── format.ts             # formatDate, relativeTime, formatFileSize, initials
    ├── storage.ts            # Type-safe localStorage wrapper
    └── constants.ts          # STATUS_META, STATUS_OPTIONS, resume constraints
```

---

## Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Pushing to GitHub

### First-time push (new repo)

```bash
# 1. Initialise git if not already
git init

# 2. Stage everything
git add .

# 3. Commit
git commit -m "feat: replace frontend with Trace — TypeScript + premium UI"

# 4. Add your remote (replace with your actual URL)
git remote add origin https://github.com/srinivasmohan20003/job-tracker.git

# 5. Push (force-push if the remote already has a history you're replacing)
git push -u origin main --force
```

> ⚠️ `--force` rewrites the remote branch. Only do this if you own the repo and understand the implications.

### Subsequent changes

```bash
git add .
git commit -m "fix: ..."
git push
```

### Working on a branch (recommended for collaboration)

```bash
git checkout -b feat/trace-frontend
git add .
git commit -m "feat: Trace premium frontend"
git push -u origin feat/trace-frontend
# Then open a Pull Request on GitHub
```

---

## Production Build & Docker

The existing `docker-compose.yml` already has a frontend Nginx container. After building:

```bash
npm run build
# dist/ is the output — configure Nginx to serve it
```

If you want to keep using the Docker setup, replace the frontend Dockerfile's build step:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## License

MIT — same as the original repo.

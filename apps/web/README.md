# Ridian Cortex Frontend

Ridian Cortex is a standalone cognitive console built on Ridian OS.

## Environment Variables

Create `.env.local` for local development (copy from `.env.example`).

Required public variables:

- `NEXT_PUBLIC_API_BASE_URL`: Backend origin used by browser requests (example: `http://localhost:8000` locally, `https://api.example.com` in production).
- `NEXT_PUBLIC_SITE_URL`: Public frontend URL used for metadata/canonical values.
- `NEXT_PUBLIC_APP_BASE_PATH`: Optional base path. Leave empty for root deployment.

Notes:

- In local development, if `NEXT_PUBLIC_API_BASE_URL` is omitted, the app falls back to `http://localhost:8000` only when running on localhost.
- In non-local environments, set `NEXT_PUBLIC_API_BASE_URL` explicitly.

## Local Run

```bash
cd apps/web
npm install
copy .env.example .env.local
npm run dev
```

Frontend: `http://localhost:3000`

## Netlify Deployment (apps/web only)

Deploy this app as a standalone Next.js site with base directory `apps/web`.

Recommended Netlify settings:

- Base directory: `apps/web`
- Build command: `npm run build`
- Publish directory: `.next`
- Functions directory: leave blank
- Node version: `20` (recommended)

Notes:

- In Netlify, `.next` must be relative to the base directory. Do not use `apps/web/.next` when the base directory is already `apps/web`.
- Netlify will provision the required functions for SSR/App Router behavior automatically.

Required Netlify environment variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_BASE_PATH` (optional, usually empty)

Example production values:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com`
- `NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app`
- `NEXT_PUBLIC_APP_BASE_PATH=`

## Deployment Behavior

- Browser requests are sent to `${NEXT_PUBLIC_API_BASE_URL}/api/chat`.
- If backend is unreachable, the UI remains responsive and shows a clear orchestrator connectivity error.
- Metadata and title are branded as Ridian Cortex built on Ridian OS.

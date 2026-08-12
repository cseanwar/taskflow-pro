# TaskFlow Pro — A Full-Stack Project Management & Team Collaboration System

Frontend for TaskFlow Pro: a Kanban / sprint project-management app built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

<details>
<summary>Project-wide docs</summary>

This client works together with the Express API in a separate repository. Read the [root README](../README.md) for the full architecture, roles/access model, and deployment guide.
</details>

## Getting Started

```bash
npm install
npm run dev        # → http://localhost:3000
```

Create `.env` (unsupported vars are ignored — the app uses these two):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000   # no /api suffix; fetchWithAuth appends it
NEXT_PUBLIC_GOOGLE_CLIENT_ID=               # optional — Google sign-in
```

> Some template leftovers (better-auth, Stripe, imgbb, Google template vars) exist in the client `.env` — they are **not** used in code.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (port 3000) |
| `npm run build` | Production build (also typechecks with `tsc`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint`) |

## Architecture

- **Server access goes through `src/actions/*.ts`** (`'use server'`) using `fetchWithAuth` from `src/lib/api.ts`, which attaches `Authorization: Bearer` from the `tfp_token` cookie and calls `NEXT_PUBLIC_API_URL` + `/api`. Don’t write ad-hoc `fetch` calls in actions — reuse `fetchWithAuth`.
- **Auth** is a JWT issued by the Express server; the httpOnly cookie is set/cleared by actions in `src/actions/auth.actions.ts`. Route protection lives in `src/middleware.ts` (`/dashboard`, `/workspaces`, `/projects`, `/calendar`, `/reports`, `/search`).
- **Roles & permissions** are mirrored client-side in `src/lib/permissions.ts` (`effectiveWorkspaceLevel`, `projectPermissions`, `maxEffectiveLevel`) to gate UI/nav. The server remains the source of truth — keep the two in sync.
- Path alias: `@/*` → `./src/*`.
- `next.config.ts` enables the React Compiler; `next` is v16 with breaking API changes — read the agent block in this repo’s `AGENTS.md` and the docs under `node_modules/next/dist/docs/` before writing Next code.

## Key Pages

Dashboard · Workspaces · Project board · Project settings · Calendar · Reports · Search · Team · Notifications · Profile · Appearance settings · Onboarding

Plus custom **404** (`src/app/not-found.tsx`) and **403** (`src/components/shared/AccessDenied.tsx`) screens designed in the same visual language.

## Verification

- Lint: `npm run lint` (eslint).
- Typecheck: `npm run build` or `npx tsc --noEmit`.
- A small, pre-existing baseline of lint errors/warnings exists (`calendar/`, `workspaces/`, `actions/`, `types/`) — don’t chase them; just don’t add new ones.
- No test framework is configured.
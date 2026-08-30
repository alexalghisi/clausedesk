# ClauseDesk

Personal portfolio project / technical case study.

Contract review: required clauses, accept/flag, missing-required report.

It is **not** a hosted commercial product. Seed data is fictional. This repository
does not claim customers, revenue, or production traffic.

**Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · PGlite (embedded Postgres) · Zod · Vitest**

---

## Author

### Alessandro Alghisi

Senior Software Engineer · Cluj-Napoca, Romania

**Twice a Google Software Engineering Intern** — Chrome (Kitchener / Waterloo)
and Logs (Mountain View).

|          |                                                                    |
| -------- | ------------------------------------------------------------------ |
| GitHub   | [github.com/alexalghisi](https://github.com/alexalghisi)       |
| LinkedIn | [linkedin.com/in/alghisi](https://www.linkedin.com/in/alghisi)                      |
| Email    | [alexalghisi@gmail.com](mailto:alexalghisi@gmail.com)                          |
| Location | Cluj-Napoca, Romania · open to remote / EU / US-friendly timezones |

**Hiring?** Open an issue, message me on LinkedIn, or email
[alexalghisi@gmail.com](mailto:alexalghisi@gmail.com).


---

## Why this exists

A packet is incomplete when a required clause is still pending — not when someone feels nervous.

---

## Implemented

- Contracts and clause catalog
- Required flag on catalog rows
- Accept / flag a clause
- Missing-required list on the dashboard

## Planned (not built)

- Diff view
- Counsel assignment

## Out of scope

- Legal advice
- Real customer contracts

---

## Architecture

One Next.js process: App Router pages, server actions, and (where needed) route
handlers. The database is **PGlite** in `.data/pglite` — real PostgreSQL SQL
without Docker. Set `DATABASE_URL` only if you point this schema at a hosted
Postgres yourself; this MVP does not ship a Compose file because this machine
cannot verify Docker.

`organization_id` always comes from the session (or the ingest key on
SentinelHub). The client never chooses the tenant.

```
Browser  →  Next.js (server actions)
                ↓
         PGlite  (.data/pglite)
```

---

## Local map

Dev server: [http://localhost:3008](http://localhost:3008)

| Surface | Path | What you should see |
| ------- | ---- | ------------------- |
| Landing | `/` | Vendor MSA case study |
| Log in | `/login` | Demo counsel |
| Packets | `/app` | Missing required first |
| Contract | `/app/contract` | Accept or flag |

Buttons use the same rounded `Button` (`rounded-md`) as the rest of the
portfolio. Failed login uses `text-sm text-destructive`.

---

## Setup

Requires Node 22+.

```bash
git clone https://github.com/alexalghisi/clausedesk.git
cd clausedesk
cp .env.example .env.local
npm install
npm run seed
npm run dev
```

### Demo account (fictional)

|          |                 |
| -------- | --------------- |
| Email    | `demo@clausedesk.dev`  |
| Password | `DemoPass123!` |
| Org      | Mesa Vendor Desk        |

Reseed by deleting `.data/pglite` and running `npm run seed` again.

---

## Scripts

```bash
npm run dev          # http://localhost:3008
npm run test         # domain rules (Vitest)
npm run typecheck
npm run lint
npm run build
npm run seed
```

CI runs typecheck, unit tests, lint, and production build on Node 22.

---

## Security notes

- Passwords are bcrypt (12 rounds).
- Session tokens are stored hashed; the cookie is HttpOnly / SameSite=lax.
- Mutating actions re-check the membership role on the server.
- `.env*` and `.data/` are gitignored.

---

## License

MIT · © Alessandro Alghisi

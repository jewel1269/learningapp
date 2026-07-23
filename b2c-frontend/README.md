# Bina B2C Frontend

Next.js 16 learner app for the B2C platform.

## Setup

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (:3000) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run test:e2e:ui` | Playwright UI mode |

## Deployment

See [../docs/DEPLOY.md](../docs/DEPLOY.md) for Docker, Render/Vercel, and env configuration.

## i18n

Supported locales: English, Bengali, Hebrew (+ fallback English for others). Language selector in navbar/settings; auto-detects browser language and timezone on first visit.

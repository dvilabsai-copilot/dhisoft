# DHISOFT frontend

Next.js 16 + React 19 frontend for the DHISOFT company website and CMS admin dashboard.

## Requirements

- Node.js 20+
- npm
- The sibling `dhisoft-cms-backend` project running on port `4008`

## Install and configure

From this directory:

```powershell
npm install
Copy-Item .env.local.example .env.local
```

The default environment points to:

```env
CMS_API_BASE_URL=http://localhost:4008/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:4008/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:4080
```

The homepage content is seeded in the backend, not in the frontend. From `dhisoft-cms-backend`, run:

```powershell
npm run prisma:deploy
npm run prisma:seed
```

## Run locally

Start the backend first, then run the frontend:

```powershell
npm run dev
```

Open `http://localhost:4080`.

For a production-style local run:

```powershell
npm run build
npm run start
```

## Checks

```powershell
npm test
npm run test:e2e
npx tsc --noEmit
```

Admin login is available at `http://localhost:4080/admin/login`. Development credentials come from the backend seed environment.

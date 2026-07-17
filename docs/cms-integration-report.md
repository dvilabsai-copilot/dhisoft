# CMS integration report

## Scope

The homepage now consumes validated published CMS content server-side and falls back to `content/default-home-content.ts` when the CMS is unavailable or returns an invalid shape. Animation timing, dashboard rail geometry, chart SVG paths, floating objects, responsive classes, and presentation layout remain in React code.

## Files changed

- Public boundary: `app/page.tsx`, `app/layout.tsx`, `types/cms.ts`, `content/default-home-content.ts`, `lib/cms-api.ts`, `lib/icon-map.tsx`, `components/home/HomePageClient.tsx`, `components/contact/ContactForm.tsx`, `components/DashboardMock.tsx`.
- Admin BFF: `lib/admin-auth.ts` and `app/api/admin/**` route handlers.
- Admin UI: `app/admin/**`, `components/admin/CmsEditor.tsx`, `components/admin/LeadsTable.tsx`, `components/admin/UserManagement.tsx`.
- Backend route configuration: `src/config/env.validation.ts` and `docs/FRONTEND_INTEGRATION_CONTRACT.md`; `.env.example` already used `API_PREFIX=api`.

## API route table

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/public/cms/home` | Published homepage |
| POST | `/api/v1/public/leads` | Store public enquiry |
| POST | `/api/v1/auth/login` | Admin login |
| POST | `/api/v1/auth/refresh` | Rotate refresh token |
| POST | `/api/v1/auth/logout` | Revoke refresh token |
| GET/PUT/POST | `/api/v1/admin/cms/pages/home*` | Draft, publish, revisions, rollback |
| GET/PATCH | `/api/v1/admin/leads*` | Paginated leads and updates |
| GET/POST/PATCH | `/api/v1/admin/users*` | Super-admin user management |

The frontend BFF exposes corresponding same-origin `/api/admin/**` handlers. Access and refresh tokens are stored only in HttpOnly cookies; they are not returned to client components, local storage, session storage, HTML, or logs. Authenticated BFF requests retry once after refresh and do not loop.

## Runtime environment

Frontend:

```env
CMS_API_BASE_URL=http://localhost:4006/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:4006/api/v1
```

`CMS_API_BASE_URL` is server-only and is used for homepage CMS fetches and admin BFF calls. The public variable is used only by the browser contact form endpoint.

Backend:

```env
PORT=4006
API_PREFIX=api
DATABASE_URL=mysql://root:@127.0.0.1:3306/dhisoft_cms
CORS_ORIGINS=http://localhost:3000
JWT_ACCESS_SECRET=<at least 32 random characters>
```

Nest URI versioning supplies `/v1`, so `API_PREFIX=api` resolves the required public routes.

## CMS fields wired

Navigation, SEO, hero, audience ticker, products, platform features, capabilities, pricing, footer/contact email, and safe dashboard scalar values (`revenue`, `revenueTarget`, `uptime`, `dataPoints`, `growth`) are wired. Products and capabilities are copied, filtered by `isActive`, and sorted by `sortOrder` without mutating API arrays. Unknown icon keys use the fixed Sparkles fallback.

## Deliberately not CMS-controlled

The CMS cannot control chart paths, card order, card movement, animation durations/delays, arc offsets, scales, opacity, tilt, responsive breakpoints, Tailwind classes, floating background effects, or arbitrary HTML/scripts/styles/canonical markup.

## Verification

- `npx tsc --noEmit` (frontend): passed.
- `npm run build` (frontend): passed; homepage and all admin/BFF routes compiled.
- `npm test` (frontend/Vitest): passed, 5 contract tests covering response validation, safe URL rejection, filtering/sorting, icon fallback, and API fallback.
- `npm run test:e2e` (Playwright/Chromium): passed, 3 tests covering live CMS homepage content, horizontal overflow, mocked lead submission, mobile content/navigation affordances, and authenticated admin CMS loading.
- Frontend build fallback path: exercised during build; backend was offline and the homepage used fallback content.
- `npm run lint` (frontend): not runnable as declared because `next lint` is removed/unsupported by Next 16 and is interpreted as a directory argument.
- Backend `npm run prisma:validate`, `npm run prisma:generate`, `npm run build`, and `npm test`: blocked before execution because the local backend `node_modules` tree has no `.bin` executables; npm install attempts failed/hung in the environment. Backend-online HTTP/Swagger and Playwright checks therefore remain pending.

## Unresolved risks

The live backend route table and database-backed homepage have not been runtime-verified in this environment. Before release, install backend dependencies, run Prisma validation/generation, seed the database, start Nest with `API_PREFIX=api`, and run HTTP plus Playwright smoke checks against both live and fallback paths.

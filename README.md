# AIPCPP Frontend

Frontend application for the AIPCPP-Onboarding-Mahi. The app is built with Next.js, React, TypeScript, Mantine, Tailwind CSS, Redux Toolkit, and RTK Query.

## Table Of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State And API Layer](#state-and-api-layer)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Convention](#commit-convention)

## Tech Stack

- Next.js 14 with the Pages Router
- React 18
- TypeScript
- Mantine UI
- Tailwind CSS
- Redux Toolkit and RTK Query
- Jest and Testing Library
- Playwright for end-to-end tests
- ESLint and Prettier

## Getting Started

### Requirements

- Node.js `>=20.14`
- npm or Yarn

### Install Dependencies

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn install
```

### Configure Environment

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Update the values in `.env.local` for your local backend and asset hosts.

### Run The App

```bash
npm run dev
```

or:

```bash
yarn start:dev
```

The app starts on `http://localhost:3000` by default.

## Environment Variables

The app reads environment values from `shared/env.constants.ts`.

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Runtime mode used by Next.js and supporting tooling. |
| `NEXT_PUBLIC_STAGE_ENV` | Public stage name. Expected values include `local`, `development`, and `production`. |
| `NEXT_PUBLIC_API_BASE_URL` | Public API base URL used by frontend API helpers. |
| `NEXT_PUBLIC_S3_CDN_BASE_URL` | Public CDN or object storage base URL for file assets. |
| `NEXT_PUBLIC_ENV_STAGE` | Additional public environment stage value. |
| `BASE_URL` | Base app URL used by tests and supporting utilities. |

For end-to-end tests, copy `.env.test.example` and provide:

| Variable | Purpose |
| --- | --- |
| `LOGIN_EMAIL` | Test user email or username. |
| `LOGIN_PASSWORD` | Test user password. |
| `BASE_URL` | App URL used by Playwright tests. |
| `STAGE_ENV` | Test stage, commonly `local`. |

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run start:dev` | Alias for `next dev`. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after a build. |
| `npm run lint` | Run Next.js linting. |
| `npm run eslint:lint` | Run ESLint against `pages`, `modules`, and `shared`, with auto-fix enabled. |
| `npm run prettier:format` | Format the repository with Prettier. |
| `npm test` | Run Jest tests. |
| `npm run test:e2e:local` | Run Playwright tests against the local stage. |
| `npm run test:e2e:local:ui` | Open the Playwright UI runner. |
| `npm run test:e2e:local:report` | Open the last Playwright report. |
| `npm run test:e2e:local:codegen` | Start Playwright codegen. |
| `npm run rtk-query:codegen` | Generate RTK Query code from `openapi-config.ts`. |

Yarn equivalents are also available, for example `yarn test` and `yarn build`.

## Project Structure

```text
.
├── pages/                 # Next.js page routes. Only *.page.tsx files are routed.
├── modules/               # Feature modules and feature-local components.
├── shared/                # Shared components, hooks, Redux, types, themes, and utilities.
├── styles/                # Global styles.
├── e2e-tests/             # Playwright test helpers and test data.
├── integration-tests/     # Integration test page objects.
├── infra/                 # Deployment and Docker-related files.
├── public/                # Static assets.
└── .github/               # CI workflows and GitHub templates.
```

Feature modules should keep feature-specific UI close to the module. Shared, reusable building blocks belong under `shared/`.

## Routing

This app uses Next.js page extensions configured in `next.config.mjs`:

```js
pageExtensions: ["page.tsx"]
```

That means only files ending in `.page.tsx` are Next.js routes. Examples:

- `pages/index.page.tsx` maps to `/`
- `pages/dashboard.page.tsx` maps to `/dashboard`
- `pages/[notFound]/index.page.tsx` maps to the dynamic `[notFound]` route

The app also defines a local API rewrite:

```text
/api/v1/:path* -> http://localhost:8000/api/v1/:path*
```

## State And API Layer

Redux is configured in `shared/redux/store.ts`.

The document API lives in `shared/redux/rtk-apis/documents.api.ts` and uses RTK Query. Components using RTK Query hooks must render under `ReduxProvider`; the app does this in `pages/_app.page.tsx`.

When testing components that depend on Redux, Mantine, or RTK Query, use:

```tsx
import { renderWithProviders } from "@/shared/utils/test-utils";
```

This wraps test UI with the Redux and Mantine providers.

## Testing

### Unit And Component Tests

Jest is configured in `jest.config.js` with `ts-jest` and the `jsdom` environment.

Run all tests:

```bash
npm test
```

Run a focused test file:

```bash
npm test -- modules/dashboard/__tests__/Dashboard.test.tsx
```

Test files can use `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx`.

### End-To-End Tests

Run local Playwright tests:

```bash
npm run test:e2e:local
```

Open Playwright UI:

```bash
npm run test:e2e:local:ui
```

## Code Style

- Use TypeScript for application code.
- Prefer the `@/` alias for imports from the repository root.
- Keep feature-specific components inside their feature module.
- Use `index.ts` barrel files when a component folder already follows that convention.
- Keep test helpers in `shared/utils/test-utils.tsx` or close to the tests when they are feature-specific.
- Use Mantine components and the existing Tailwind theme tokens where possible.
- Run ESLint and focused tests before opening a pull request.

## Commit Convention

Commit messages should follow:

```text
subject(ticket-code): message
```

Valid subjects:

```text
build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
```

Example:

```text
feat(AIPCPP-123): add document search filters
```

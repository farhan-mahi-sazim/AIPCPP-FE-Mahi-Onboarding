# AGENTS.md

> Coding agents repo-specific context for safe and consistent work in the AIPCPP-Onboarding project.

---

## Table of Contents

- [Sazim Frontend Development Convention](#sazim-frontend-development-convention)
  - [Directory Structure & File Naming](#1-directory-structure--file-naming)
  - [UI/Logic Split (Container-Presenter Pattern)](#2-sazim-uilogic-split-container-presenter-pattern)
  - [Type Safety & Validation Boundaries](#3-strict-type-safety--validation-boundaries)
  - [Provider Requirements](#provider-requirements)
  - [Component Failure & State Guardrails](#component-failure--state-guardrails)
- [Testing Guidance](#testing-guidance)
- [Styling Guidance](#styling-guidance)
- [Environment Notes](#environment-notes)
- [Safety Rules](#safety-rules)
- [Pull Request Checklist](#pull-request-checklist)
- [Code of Conduct](#code-of-conduct)

---

## Sazim Frontend Development Convention

Agents must strictly adhere to the guidelines below when generating or refactoring code.

---

### 1. Directory Structure & File Naming

| Type                      | Convention                               |
| ------------------------- | ---------------------------------------- |
| Route Files               | `pages/` ending with `.page.tsx`         |
| Feature Code              | `modules/<feature_name>/`                |
| Presentational Components | `<ComponentName>.tsx`                    |
| Container/Logic Hooks     | `use<ComponentName>.ts`                  |
| Validation Schemas        | `<feature>.schema.ts`                    |
| Types                     | `<feature>.types.ts`                     |
| Barrel Files              | `index.ts` in every feature subdirectory |

> **Note:** Never bleed logic across feature boundaries. Do not import deeply from nested internal paths.

---

### 2. Sazim UI/Logic Split (Container-Presenter Pattern)

#### Zero Logic in UI

Presentational components must be pure, stateless visual representations. They accept data and callbacks only via strongly-typed props:

- ❌ No `useQuery`, no `dispatch`
- ❌ No direct local complex state computation

#### Custom Hook Encapsulation

All state management, side effects, form handling, and RTK Query triggers must be extracted into a localized custom companion hook.

#### Example

```typescript
// Bad: Mixing concerns
export const DashboardCard = () => {
  const { data } = useGetDocsQuery();
  return <div>{data?.name}</div>;
};

// Good (Sazim Split):
// useDashboardCard.ts -> Handles RTK Query, transformations, loading state
// DashboardCard.tsx -> Accepts { data, isLoading } props and renders layout
```

---

### 3. Strict Type Safety & Validation Boundaries

- ❌ **Prohibited:** `any`, `unknown` type-casting, or `// @ts-ignore`
- ✅ **Required:** All incoming external API or contract payloads must be validated at the network-to-application boundary using localized schemas (e.g., **Zod** or strict RTK Query transformation functions)

---

## Provider Requirements

The application provider stack is defined in `pages/_app.page.tsx`.

| Component                | Requirement           |
| ------------------------ | --------------------- |
| RTK Query hooks          | `ReduxProvider`       |
| Mantine components       | `MantineProvider`     |
| Provider-dependent tests | `renderWithProviders` |

```typescript
import { renderWithProviders } from "@/shared/utils/test-utils";
```

> Avoid raw Testing Library `render` for connected or Mantine-based components unless the test intentionally supplies its own wrappers.

---

## Component Failure & State Guardrails

### Localized Error Boundaries

Every independent Sazim feature block within `modules/` must be wrapped in a localized Error Boundary to prevent a localized component crash from destroying the shell viewport.

### Three-State Mandate

Asynchronous presentation blocks must explicitly design, implement, and style three states:

| State       | Implementation                                                          |
| ----------- | ----------------------------------------------------------------------- |
| `isLoading` | Mantine Skeletons or spin indicators                                    |
| `isEmpty`   | Explicit fallback graphic/text when array lengths or values are nullish |
| `isSuccess` | The populated active UI state                                           |

---

## Testing Guidance

- Add or update tests for behavior changes
- Keep tests close to the feature when they are feature-specific
- Use focused Jest commands while developing
- Mock RTK Query hooks in component tests when testing component states directly
- Prefer `screen` queries that reflect user-visible behavior
- Run the touched test file and lint touched files before finishing

---

## Styling Guidance

- Use existing **Tailwind** theme tokens from `tailwind.config.js`
- Use **Mantine** components where the app already uses Mantine patterns
- Keep dashboard-specific components under `modules/dashboard/components`
- Avoid broad visual rewrites unless the request explicitly asks for them

---

## Environment Notes

1. Copy `.env.example` to `.env.local` for local development
2. The Next config rewrites local API requests:

```text
/api/v1/:path* → http://localhost:8000/api/v1/:path*
```

> If API behavior looks wrong locally, confirm the backend is running on `localhost:8000` and that `.env.local` values match the desired target.

---

## Safety Rules

- ❌ Do not revert user changes unless explicitly asked
- ❌ Keep edits scoped to the request
- ❌ Do not run destructive git commands
- ❌ Do not commit unless the user asks
- ✅ Read the existing implementation before changing patterns
- ✅ Prefer `rg` for searching
- ✅ Use `apply_patch` for manual file edits
- ✅ Write self-documenting code over excessive comments (e.g., `use documentPayload` instead of `docPl`)
- ❌ If tests fail because of missing services or environment variables, report that clearly with the command that failed

---

## Pull Request Checklist

Before handing work back, verify the following:

- [ ] Code compiles or the touched TypeScript paths are lint-clean
- [ ] Focused tests pass for the changed area
- [ ] New provider-dependent component tests use `renderWithProviders`
- [ ] Code strictly complies with the Sazim UI/Logic split convention
- [ ] README or AGENTS.md is updated when workflow or architecture changes

---

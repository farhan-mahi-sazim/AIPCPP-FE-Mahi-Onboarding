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
- [General Notes](#general-notes)
- [Responsive Design Principles](#responsive-design-principles)
- [Folder Structure](#folder-structure)
- [Code Generation](#code-generation)
- [RTK-Query and Shared Types](#rtk-query-and-shared-types)
- [Filename Convention](#filename-convention)
- [Variable Naming Convention](#variable-naming-convention)
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

## General Notes

- No magic values in code. Always extract strings/numbers to constants.
- Prefer enums over string literals.
- Prefer ternary operators (`booleanValue ? doX() : doY()`) as opposed to boolean short-circuit evaluation (`booleanValue && doX()`).
- Don't use `px` for sizing. Always use `rem`/`em` units.
- If using Tailwind, use canonical Tailwind classes (e.g., `h-10`, `m-4`, `p-2`, `space-2`).
- Try to use numbers divisible by 4 for padding/margin/sizes for consistency.
- Before implementing something, check the `shared/` folder for existing utilities or components you can reuse or extend.
- To refer to paths of pages within the application (e.g., for redirects), use the routes file. All such links should live in this file.
- When calling RTK Query mutation functions from mutation hooks, always call `.unwrap()`. Without this, `try-catch` blocks will never work because the returned Promise will remain pending.
- Always use `date-fns`/`dayjs` packages to parse dates. The native `Date` constructor is inconsistent and not recommended.

```typescript
const [someMutation] = useSomeMutation();

try {
  await someMutation().unwrap();
} catch (error) {
  // handle error
}
```

---

## Responsive Design Principles

- Always build for the smallest viewports first using base Tailwind utilities. Progressively enhance the layout for tablets and desktops using breakpoint modifiers (e.g., `md:`, `lg:`, `xl:`).
- Prioritize inherent responsiveness over rigid, fixed-width breakpoints. Rely heavily on CSS Grid (e.g., `grid-cols-1 md:grid-cols-3`) and Flexbox (`flex-wrap`, `gap-4`) so elements naturally flow, wrap, and scale.
- Adapt UI per device. For example, a data-heavy desktop view might use a ShadCN Table, but on mobile it should adapt into a stacked Card list. Swap desktop Dialog components for bottom-anchored Drawer components on mobile screens.
- Never hardcode layout dimensions in pixels. Rely entirely on Tailwind's default rem-based scale (divisible-by-4 spacing system like `p-4` or `gap-8`).
- Ensure all images, illustrations, and videos scale fluidly within their containers and use lazy loading through NextImage. Use classes like `max-w-full`, `h-auto`, and `object-cover` to prevent media from breaking out of bounds.
- Design with touch ergonomics in mind. On mobile breakpoints, ensure buttons, dropdowns, and form inputs maintain an adequate tap area (minimum `h-10` to `h-12`) with enough gap to prevent accidental misclicks.
- Anticipate dynamic content lengths and narrow viewports. Use Tailwind utilities like `break-words`, `whitespace-normal`, or `line-clamp` to safely manage long strings.

---

## Folder Structure

```
modules
├── dashboard
│   ├── customers
│   │   ├── [customer]
│   │   │   ├── containers
│   │   │   │   ├── CustomerContainer.tsx
│   │   │   │   └── CustomerContainer.styles.tsx
│   │   │   ├── components
│   │   │   │   └── CustomerCard
│   │   │   │       ├── CustomerCard.tsx
│   │   │   │       ├── CustomerCard.styles.tsx
│   │   │   │       └── index.ts
│   │   │   └── hooks
│   │   │       └── useCustomerType.tsx
│   │   ├── components
│   │   │   ├── CustomersTable
│   │   │   │   ├── CustomersTable.tsx
│   │   │   │   ├── CustomersTable.styles.tsx
│   │   │   │   └── index.ts
│   │   │   └── CustomersCard
│   │   │       ├── CustomersCard.tsx
│   │   │       ├── CustomersCard.styles.tsx
│   │   │       └── index.ts
│   │   └── containers
│   │       ├── CustomersPageContainer.styles.tsx
│   │       └── CustomersPageContainer.tsx
│   └── resume-builder
│       ├── components
│       │   └── ResumePreview
│       │       ├── index.ts
│       │       ├── ResumePreview.styles.tsx
│       │       └── ResumePreview.tsx
│       └── containers
│           ├── ResumeBuilderPageContainer.styles.tsx
│           └── ResumeBuilderPageContainer.tsx
├── components
│   └── HomeComponent
│       ├── HomeComponent.tsx
│       ├── HomeComponent.styles.ts
│       └── HomeComponent.types.ts
└── containers
    ├── HomePageContainer.styles.tsx
    ├── HomePageContainer.tsx
    └── HomePageContainer.types.tsx
pages
├── dashboard
│   └── customers
│       ├── index.page.tsx
│       └── [customerId]
│           └── index.page.tsx
├── resume-builder
│   └── index.page.tsx
├── index.page.tsx
├── _app.page.tsx
└── _document.page.tsx
shared
├── components
│   └── Button
│       ├── Button.tsx
│       ├── Button.styles.tsx
│       └── index.ts
├── hooks
│   └── useWindowSize.tsx
├── layouts
│   ├── DashboardLayout
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardLayout.styles.tsx
│   │   └── index.ts
│   └── MainLayout
│       ├── MainLayout.tsx
│       ├── MainLayout.styles.tsx
│       └── index.ts
└── utils
```

### Reserved Route Names

The following words are reserved and should not be used as route names:

- `containers`, `components`, `hooks`, `utils`, `styles`, `types`

### No Top-Level Barrel Files

Do not create top-level barrel files. Only create `index.ts` within the same folder as the component it exports.

```typescript
// ✅ Good
└── components/
    ├── ComponentA/
    │   ├── ComponentA.tsx
    │   └── index.ts
    └── ComponentB/
        ├── ComponentB.tsx
        └── index.ts

// ❌ Bad - no top-level index.ts re-exporting ComponentA and ComponentB
```

---

## Code Generation

Use code generation capabilities in conjunction with Swagger in the backend to sync types between frontend and backend. The generated types live in `shared/typedefs/api.ts`.

---

## RTK-Query and Shared Types

```
.
└── shared/
    ├── redux/
    │   ├── reducers
    │   ├── rtk-apis/
    │   │   ├── resourceOne/
    │   │   │   ├── resourceOne.types.ts
    │   │   │   └── resourceOne.api.ts
    │   │   ├── resourceTwo
    │   │   ├── ...
    │   │   ├── api.config.ts
    │   │   └── baseQuery.ts
    │   ├── hooks.ts
    │   └── store.ts
    └── typedefs/
        ├── api.ts
        ├── enums.ts
        ├── interfaces.ts
        ├── types.ts
        └── index.ts
```

For RTK-Query:

- Separate the folders by resource types
- Utilise [Code Splitting](https://redux-toolkit.js.org/rtk-query/usage/code-splitting)
- For types, depend on code generation tools 99% of the time. When a type needs to be extended (e.g., a PATCH endpoint requires a `userId` in addition to body data), extend from the BE-generated type in the respective resource type file.

---

## Filename Convention

| Type              | Convention           |
| ----------------- | -------------------- |
| React Components  | `ProductCard.tsx`    |
| Styled Components | `Button.styles.ts`   |
| React Hooks       | `useCustomHook.tsx`  |
| NextJS Pages      | `_document.page.tsx` |
| Generic TS Files  | `camelCase.ts`       |

---

## Variable Naming Convention

| Construct        | Convention          | Example                            |
| ---------------- | ------------------- | ---------------------------------- |
| React Component  | PascalCase          | `export const MainLayout = () =>`  |
| React Hooks      | Arrow function      | `export const useSomeHook = () =>` |
| Constants        | SNAKE_CASE_CAPS     | `export const WINDOW_SIZE = 1024`  |
| Interfaces       | `IPascalCase`       | `export interface IProduct`        |
| Types            | `TPascalCase`       | `export type TProduct`             |
| Enums            | `EPascalCase`       | `export enum ERoles { ADMIN }`     |
| Component Props  | `IProps` / `TProps` | `interface IProps { size: ESize }` |
| Helper functions | Regular function    | `export function helperFunction()` |
| Barrel index.ts  | Named export        | `export { Foo } from './Foo'`      |

> Helper functions should use regular `function` declarations to benefit from hoisting.

---

## Pull Request Checklist

Before handing work back, verify the following:

- [ ] Code compiles or the touched TypeScript paths are lint-clean
- [ ] Focused tests pass for the changed area
- [ ] New provider-dependent component tests use `renderWithProviders`
- [ ] Code strictly complies with the Sazim UI/Logic split convention
- [ ] README or AGENTS.md is updated when workflow or architecture changes

---

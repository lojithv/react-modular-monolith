# React Modular Monolith — Data Routing

A modular monolith built with **React 19**, **React Router v7** (data routing), **Vite**, and **Tailwind CSS v4**. Designed for clean module boundaries today with a clear path to **micro-frontend (MFE) migration** when needed.

## Architecture

```
root/                           App entry point, route composition, global CSS
  ├── routes.tsx                Route tree composed from module manifests
  └── navigation.ts            Centralized sidebar config (all modules, one file)
modules/                        Feature modules (self-contained, isolated)
  ├── auth/                     Public auth flows (login, register, reset)
  ├── dashboard/                Dashboard, analytics, reports
  ├── products/                 Product CRUD
  ├── users/                    User management
  ├── settings/                 App settings (general, security, notifications)
  └── _template/                Scaffold for creating new modules
shared/
  ├── api/                      Framework-agnostic HTTP client, errors, mock adapter
  ├── auth/                     Auth store singleton, React hooks, route guards
  ├── components/               App-level components (ErrorBoundary, Sidebar, Paywall, etc.)
  ├── layouts/                  RootLayout (authenticated shell with sidebar)
  ├── ui/                       Primitive UI library (Button, Input, Card, Modal, etc.)
  └── types/                    Shared TypeScript types (ModuleManifest)
scripts/
  └── audit.mjs                 Automated architecture audit
```

### Three-Layer Architecture

```
Pages (UI)  →  Services (business logic)  →  API Client (HTTP transport)
```

- **API Client** (`shared/api/`) — HTTP transport, auth headers, error normalization. Zero business logic.
- **Module Services** (`modules/*/services/`) — Domain logic, data fetching. Zero UI knowledge.
- **Pages / Loaders** (`modules/*/pages/`) — Call a service, return data. Zero business logic.

### Module System

Each module exports a `ModuleManifest` declaring its routes, role restrictions, and plan requirements. The app shell reads `modules/registry.ts` to automatically compose routing and access control.

Sidebar navigation is configured centrally in `root/navigation.ts` — one file for all modules. Sidebar visibility is auto-derived from each module's `allowedRoles` and `minPlan`, so access rules are never duplicated.

| Task | File to edit |
|---|---|
| Change route structure or pages | `modules/*/routes.ts` |
| Change who can access a module | `modules/*/index.ts` (`allowedRoles`, `minPlan`) |
| Add/remove/reorder sidebar items | `root/navigation.ts` |

```
Module → @shared/*    ✅ allowed
Module → Module       ❌ never (enforced by audit)
```

See [`modules/_template/MODULE_TEMPLATE.md`](modules/_template/MODULE_TEMPLATE.md) for the full module creation guide.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (mock API enabled by default)
npm run dev
```

The app runs with mock data out of the box — no backend needed.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | Backend API base URL |
| `VITE_API_MOCK` | `true` | Enable mock API handlers (no backend needed) |
| `VITE_AUTO_LOGIN` | `true` | Auto-login as mock admin user for dev convenience |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the codebase |
| `npm test` | Run all tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:auth` | Run only auth module tests |
| `npm run test:dashboard` | Run only dashboard module tests |
| `npm run test:products` | Run only products module tests |
| `npm run test:users` | Run only users module tests |
| `npm run test:settings` | Run only settings module tests |
| `npm run test:shared` | Run only shared library tests |
| `npm run audit:arch` | Run automated architecture audit |
| `npm run audit:arch:strict` | Audit with warnings treated as errors |

## Creating a New Module

1. Copy `modules/_template` to `modules/<name>`
2. Find-and-replace placeholders: `__name__` → `order`, `__Name__` → `Order`, `__NAME__` → `ORDER`
3. Rename files to match your module name
4. Register in `modules/registry.ts`, `root/main.tsx` (mocks), `vite.config.ts` (test project), and `package.json` (test script)
5. Add a sidebar entry in `root/navigation.ts`

Full guide: [`modules/_template/MODULE_TEMPLATE.md`](modules/_template/MODULE_TEMPLATE.md)

## Architecture Audit

An automated audit script checks module boundaries, MFE readiness, service patterns, and registration completeness:

```bash
npm run audit:arch
```

This runs 10 checks across all modules and reports violations. For a full manual + automated audit, ask an AI agent:

> "Run the weekly architecture audit"

See [`ARCHITECTURE_AUDIT.md`](ARCHITECTURE_AUDIT.md) for the complete checklist.

## MFE Migration Path

This codebase is designed for clean migration to micro-frontends when the time comes:

- **Module isolation** — no cross-module imports (enforced by audit)
- **Declarative manifests** — `ModuleManifest` maps directly to Module Federation remotes
- **`globalThis` singletons** — `authStore` and `apiClient` survive across independently loaded bundles
- **Lazy-loaded routes** — code-splitting boundaries align with MFE boundaries
- **Framework-agnostic services** — no React in the business logic layer
- **Per-module test configs** — each module has its own Vitest project

The migration is primarily a **build/infra change** — add Module Federation config, make the registry load remotes dynamically. Application code stays untouched.

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| React Router | 7.x | Data routing with loaders, lazy routes, guards |
| Vite | 7.x | Build tooling and dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Vitest | 3.x | Unit and component testing |
| Testing Library | 16.x | React component test utilities |
| TypeScript | 5.9 | Type safety |

## Cursor Rules

AI agents working in this codebase are guided by rules in `.cursor/rules/`:

| Rule | Scope | Purpose |
|---|---|---|
| `project-architecture.mdc` | Always | Directory structure, three-layer architecture, import rules |
| `weekly-audit.mdc` | On demand | Weekly architecture audit protocol |
| `testing-conventions.mdc` | Test files | Vitest patterns, auth testing helpers |
| `auth-patterns.mdc` | Auth files | Auth store singleton, guard responsibilities |

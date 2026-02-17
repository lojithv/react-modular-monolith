# Architecture Audit Checklist

> **Run weekly** by developers or AI agents to keep the codebase modular, clean, and MFE-ready.

## Quick Start

```bash
# Automated checks (catches ~80% of issues)
npm run audit:arch

# Full audit (automated + manual review)
# Ask an AI agent: "run the weekly architecture audit"
```

---

## Automated Checks (`scripts/audit.mjs`)

The script verifies these rules programmatically:

| #  | Check                         | Severity | What it catches                                     |
|----|-------------------------------|----------|-----------------------------------------------------|
| 1  | Module structure completeness | FAIL     | Missing `index.ts`, `routes.ts`, `layout.tsx`, `pages/` |
| 2  | Cross-module imports          | FAIL     | Module A importing from Module B                    |
| 3  | Service layer patterns        | FAIL     | Raw `fetch()` or React hooks in services            |
| 4  | Page component patterns       | WARN     | Missing `export function Component` for lazy()      |
| 5  | Route lazy loading            | FAIL     | Static `Component:` or `element:` in routes.ts      |
| 6  | Module registration           | FAIL     | Module missing from registry.ts or main.tsx mocks   |
| 7  | Singleton patterns            | FAIL     | `window.*` state instead of `globalThis`            |
| 8  | Type isolation                | FAIL     | Types imported across module boundaries             |
| 9  | DOM / global state access     | WARN     | `document.querySelector`, `localStorage` in modules |
| 10 | Import extensions             | WARN     | Missing `.ts`/`.tsx` on relative imports            |

---

## Manual Review Checklist

These require human (or AI) judgment and can't be fully automated.

### A. Module Boundaries

- [ ] No module imports from another module (only `@shared/*` and framework packages)
- [ ] `modules/registry.ts` lists every module in `modules/` (except `_template`)
- [ ] `root/main.tsx` registers mock handlers for every module that has `__mocks__/`
- [ ] `vite.config.ts` → `test.projects` includes every module's `vitest.config.ts`
- [ ] `package.json` has a `test:<module>` script for each module

### B. MFE Readiness

- [ ] All shared singletons use `globalThis.__KEY__` pattern
- [ ] `authStore` and `apiClient` are the ONLY global singletons
- [ ] No module writes to `window.*`, `document.*`, `localStorage`, or `sessionStorage` directly
- [ ] All routes use `lazy: () => import(...)` (zero static imports in route trees)
- [ ] All pages export a named `Component` function (not `export default`)
- [ ] Services are pure TypeScript classes — zero React/JSX imports
- [ ] Shared UI components receive data via props, not by reaching into module stores
- [ ] CSS uses Tailwind utility classes (no global CSS leaks between modules)

### C. Code Quality

- [ ] Each module's domain types live in its own `types.ts`
- [ ] Types never cross module boundaries (use `@shared/types` for shared contracts)
- [ ] Services return properly typed responses (`Promise<T>`)
- [ ] Page loaders are thin — call service method, return data, no business logic
- [ ] No `any` types in module files (services, pages, types)
- [ ] Error handling uses `ApiError` from `@shared/api`
- [ ] Module manifest (`index.ts`) declares correct `allowedRoles` and `minPlan`

### D. Test Coverage

- [ ] Every module has a `__tests__/` directory
- [ ] Every route guard has corresponding tests in `shared/auth/__tests__/`
- [ ] Services with branching logic have unit tests
- [ ] Mock handlers cover all service methods (list, getById, create, update, delete)
- [ ] Per-module `vitest.config.ts` files exist and are registered

### E. Consistency

- [ ] All modules follow the same file structure (compare against `modules/_template/`)
- [ ] Naming conventions: `camelCase` module names, `PascalCase` components/types
- [ ] Module layouts follow the NavLink + Outlet pattern
- [ ] New modules were registered in all 4 places (registry, main.tsx, vite.config, package.json)

---

## Common Violations & Fixes

### Cross-module import

```
❌ modules/dashboard/pages/Home.tsx imports from @modules/products/types.ts
```

**Fix**: Move the shared type to `shared/types/` and import from there in both modules.

### React in services

```
❌ modules/orders/services/order.service.ts imports useState from react
```

**Fix**: Services must be framework-agnostic. Move React state logic to the page component or a custom hook in the module's `hooks/` folder.

### Static route import

```
❌ modules/orders/routes.ts has `Component: OrderList` (static)
```

**Fix**: Use `lazy: () => import('./pages/OrderList.tsx')` for code-splitting.

### Missing globalThis for shared state

```
❌ shared/store/theme.ts uses `let currentTheme = 'light'` (module-level state)
```

**Fix**: Wrap in a class with `globalThis.__THEME_STORE__` singleton, same pattern as `authStore`.

### Missing mock registration

```
❌ modules/orders has __mocks__/orders.mock.ts but it's not in root/main.tsx
```

**Fix**: Add to the `VITE_API_MOCK` block in `root/main.tsx`:

```ts
const { registerOrderMocks } = await import('@modules/orders/services/__mocks__/orders.mock.ts');
registerOrderMocks();
```

---

## Audit Frequency

| Check Type        | Frequency   | Who                  |
|-------------------|-------------|----------------------|
| Automated script  | Every PR    | CI pipeline / dev    |
| Full manual audit | Weekly      | AI agent or tech lead |
| Post-new-module   | On creation | Module author        |

---

## Running the Audit

### Developers

```bash
npm run audit:arch          # Automated checks
npm run audit:arch:strict   # Fail on warnings too
```

### AI Agents (Cursor)

Say: **"Run the weekly architecture audit"**

The AI agent will:
1. Run `node scripts/audit.mjs` and report automated findings
2. Perform the manual checklist above
3. Present a structured report with action items

### CI Integration

Add to your CI pipeline:

```yaml
- name: Architecture audit
  run: npm run audit:arch
```

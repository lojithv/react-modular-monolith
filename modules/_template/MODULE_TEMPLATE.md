# Module Template — Reference Guide

> **Audience**: AI agents and developers creating new feature modules.

## Quick Start Checklist

When creating a new module (e.g. `orders`), follow these steps in order:

### 1. Copy and rename

```
cp -r modules/_template modules/orders
```

### 2. Find-and-replace placeholders

| Placeholder    | Replace with (example) | Used for                     |
| -------------- | ---------------------- | ---------------------------- |
| `__name__`     | `order`                | camelCase — paths, variables |
| `__Name__`     | `Order`                | PascalCase — types, classes  |
| `__NAME__`     | `ORDER`                | UPPER_CASE — mock constants  |

Rename files too:

```
services/__name__.service.ts      → services/order.service.ts
services/__mocks__/__name__.mock.ts → services/__mocks__/orders.mock.ts
pages/__Name__List.tsx            → pages/OrderList.tsx
pages/__Name__Detail.tsx          → pages/OrderDetail.tsx
pages/Create__Name__.tsx          → pages/CreateOrder.tsx
pages/Edit__Name__.tsx            → pages/EditOrder.tsx
```

### 3. Register the module

**`modules/registry.ts`** — add the import and push to the array:

```ts
import { ordersModule } from './orders/index.ts';

export const modules: ModuleManifest[] = [
  // ...existing modules
  ordersModule,
];
```

### 4. Register mock handlers (if using mocks)

**`root/main.tsx`** — inside the `VITE_API_MOCK` block:

```ts
const { registerOrderMocks } = await import(
  '@modules/orders/services/__mocks__/orders.mock.ts'
);
registerOrderMocks();
```

### 5. Register the test project

**`vite.config.ts`** — add to the `test.projects` array:

```ts
test: {
  projects: [
    // ...existing projects
    'modules/orders/vitest.config.ts',
  ],
},
```

**`package.json`** — add the convenience script:

```json
"test:orders": "vitest --project orders"
```

### 6. Done!

The app shell reads `modules/registry.ts` and automatically:
- Adds routes to the router (with guards based on your manifest)
- Adds sidebar entries to the navigation
- Applies role, plan, and feature guards

---

## File Structure

```
modules/orders/
├── index.ts                          # ModuleManifest export
├── routes.ts                         # Route subtree (lazy-loaded)
├── layout.tsx                        # Module layout with sub-nav + <Outlet />
├── types.ts                          # Domain types (Order, CreateOrderInput, etc.)
├── vitest.config.ts                  # Per-module test configuration
├── services/
│   ├── order.service.ts              # Business logic (API calls via apiClient)
│   └── __mocks__/
│       └── orders.mock.ts            # Mock handlers for VITE_API_MOCK=true
├── pages/
│   ├── OrderList.tsx                 # List page       (index route)
│   ├── OrderDetail.tsx               # Detail page     (:orderId)
│   ├── CreateOrder.tsx               # Create page     (new)
│   └── EditOrder.tsx                 # Edit page       (:orderId/edit)
└── __tests__/                        # Module-specific tests
    └── *.test.{ts,tsx}
```

---

## Architecture Rules

### Module isolation (CRITICAL)

```
✅ Module → @shared/*                 Allowed (shared code)
✅ Module → react-router, react       Allowed (framework)
❌ Module → @modules/other-module     NEVER import across modules
❌ Module → @root/*                   NEVER import from root
```

Modules communicate only through:
- **Shared state**: `authStore` via `@shared/auth`
- **Shared API client**: `apiClient` via `@shared/api`
- **Shared types**: `@shared/types`
- **Route navigation**: React Router `Link`, `navigate()`

### Page components pattern

Every page file exports a named `Component` function (React Router convention for `lazy`):

```ts
// For pages WITH data loading:
export async function loader({ params }: LoaderFunctionArgs) {
  const data = await myService.getById(params.id!);
  return { data };
}

export function Component() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{/* render data */}</div>;
}

// For pages WITHOUT data loading:
export function Component() {
  return <div>{/* static or client-side content */}</div>;
}
```

### Service layer pattern

- One service class per module
- Uses `apiClient` from `@shared/api`
- Framework-agnostic (no React hooks or JSX)
- Exported as a singleton instance

```ts
class OrderService {
  async list(): Promise<PaginatedResponse<Order>> { ... }
  async getById(id: string): Promise<Order> { ... }
  async create(input: CreateOrderInput): Promise<Order> { ... }
  async update(id: string, input: UpdateOrderInput): Promise<Order> { ... }
  async remove(id: string): Promise<void> { ... }
}

export const orderService = new OrderService();
```

### Mock handler pattern

- Located in `services/__mocks__/`
- Uses `registerMock('METHOD /path', handler)` from `@shared/api`
- Supports path params: `GET /orders/:id`
- Registered in `root/main.tsx` under the `VITE_API_MOCK` guard

### ModuleManifest fields

```ts
interface ModuleManifest {
  name: string;                   // Unique ID (e.g. 'orders')
  routes: RouteObject;            // React Router subtree
  sidebar?: SidebarItem[];        // Nav entries (omit for hidden modules)
  allowedRoles?: UserRole[];      // 'admin' | 'editor' | 'viewer'
  minPlan?: PlanTier;             // 'free' | 'starter' | 'pro' | 'enterprise'
  public?: boolean;               // true = no auth required (e.g. auth module)
}
```

---

## Customization Options

### Module without CRUD

Not every module needs all 4 CRUD pages. Delete what you don't need and trim `routes.ts`:

```ts
const routes: RouteObject = {
  path: 'analytics',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/AnalyticsHome.tsx') },
    { path: 'reports', lazy: () => import('./pages/Reports.tsx') },
  ],
};
```

### Module without a service layer

If the module is purely UI (e.g. settings), skip `services/` entirely and use local state:

```ts
export function Component() {
  return <div>Static or client-only content</div>;
}
```

### Public module (no auth)

Set `public: true` in the manifest. The module renders outside the authenticated shell:

```ts
export const myModule: ModuleManifest = {
  name: 'landing',
  routes: landingRoutes,
  public: true,
};
```

### Nested guards inside a module

Import guard helpers in your `routes.ts` for per-route protection:

```ts
import { withFeatures } from '@root/routes.tsx';

const routes: RouteObject = {
  path: 'orders',
  lazy: () => import('./layout.tsx'),
  children: [
    { index: true, lazy: () => import('./pages/OrderList.tsx') },
    {
      ...withFeatures(['advanced-analytics']),
      children: [
        { path: 'analytics', lazy: () => import('./pages/OrderAnalytics.tsx') },
      ],
    },
  ],
};
```

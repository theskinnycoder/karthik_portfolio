# Next.js 16 Caching Patterns

Detailed reference for caching in Next.js 16 with Cache Components.

## The "use cache" Directive

### Enabling Cache Components

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true, // Required for "use cache"
};
```

### Page-Level Usage

```tsx
// src/app/page.tsx
"use cache";

import { cachePageLife } from "@/lib/caching";

export default async function Page() {
  cachePageLife(); // Apply explicit cache life (1d revalidate, 1w expire)

  // Entire page is cached and prerendered
  const data = await fetchData();
  return <main>{/* ... */}</main>;
}
```

**Important**: Without an explicit `cacheLife()` call, pages use the `default` profile (15m revalidate). Inner caches with longer lifetimes cannot extend beyond this default.

### Function-Level Usage

```tsx
export async function getData() {
  "use cache";
  // Function output is cached
  return await fetch("/api/data");
}
```

### File-Level Usage

```tsx
// All exports in this file are cached
"use cache";

export async function getUsers() { /* ... */ }
export async function getPosts() { /* ... */ }
```

## Cache Keys

Cache entries are keyed by:
1. **Build ID** - Changes on each build
2. **Function ID** - Hash of function location and signature
3. **Serializable arguments** - Props/function arguments

```tsx
async function getData(userId: string) {
  "use cache";
  // Different userId = different cache entry
  return fetch(`/api/users/${userId}`);
}
```

## cacheLife() Profiles

### Built-in Profiles

```tsx
import { cacheLife } from "next/cache";

// Use predefined profiles
cacheLife("seconds"); // Very short
cacheLife("minutes"); // Short
cacheLife("hours");   // Medium (good for frequently updated)
cacheLife("days");    // Long (good for portfolio content)
cacheLife("weeks");   // Very long
cacheLife("max");     // Maximum (rarely updated)
```

### Profile Values

| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| `default` | 5m | 15m | 1y |
| `seconds` | 30s | 1s | 1m |
| `minutes` | 5m | 1m | 1h |
| `hours` | 5m | 1h | 1d |
| `days` | 5m | 1d | 1w |
| `weeks` | 5m | 1w | 30d |
| `max` | 5m | 30d | 1y |

**Note**: Without an explicit `cacheLife()`, the `default` profile is used (15m revalidate). Inner caches with longer lifetimes cannot extend beyond this.

### Custom Profiles

```tsx
// In next.config.ts
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    portfolio: {
      stale: 3600,       // 1 hour
      revalidate: 86400, // 1 day
      expire: 604800,    // 1 week
    },
  },
};

// In your code
cacheLife("portfolio");
```

### Inline Custom Values

```tsx
cacheLife({
  stale: 3600,      // Seconds until considered stale (client)
  revalidate: 7200, // Seconds until server revalidates
  expire: 86400,    // Seconds until cache expires completely
});
```

## cacheTag() for Revalidation

### Tagging Cached Functions

```tsx
import { cacheTag, cacheLife } from "next/cache";

export async function getProducts() {
  "use cache";
  cacheLife("days");
  cacheTag("products"); // Enable targeted revalidation

  return db.query("SELECT * FROM products");
}
```

### Multiple Tags

```tsx
export async function getProductWithCategory(id: string) {
  "use cache";
  cacheTag("products", `product-${id}`, "categories");
  // Can be revalidated by any of these tags
}
```

## Revalidation APIs

### revalidateTag() - Stale-While-Revalidate

Used in **Route Handlers** and **Server Actions**:

```tsx
import { revalidateTag } from "next/cache";

// In API route (webhook)
export async function POST(request: NextRequest) {
  revalidateTag("products", "max"); // Stale-while-revalidate
  return NextResponse.json({ revalidated: true });
}
```

**Behavior:**
1. Mark tag as stale
2. Serve cached content to current request
3. Refresh cache in background
4. Subsequent requests get fresh content

### updateTag() - Immediate Invalidation

Used only in **Server Actions**:

```tsx
"use server";

import { updateTag } from "next/cache";

export async function createProduct(data: FormData) {
  await db.products.create(data);
  updateTag("products"); // Immediate - no stale content served
}
```

**Use for:** Read-your-own-writes scenarios where user must see their change immediately.

### revalidatePath() - Path-Based

```tsx
import { revalidatePath } from "next/cache";

export async function updatePage(slug: string) {
  await db.pages.update(slug);
  revalidatePath(`/pages/${slug}`);
}
```

## When Suspense is NOT Needed

If your data functions use `"use cache"`, the content is **prerendered into the static shell**:

```tsx
"use cache"; // Page is static

export default async function Page() {
  // These all use "use cache" internally
  const testimonials = await getTestimonials();
  const companies = await getCompanies();

  return (
    <main>
      {/* No Suspense needed - content is in static shell */}
      <TestimonialsSection data={testimonials} />
      <CompanyLogos data={companies} />
    </main>
  );
}
```

## When Suspense IS Needed

For **dynamic/runtime data** that can't be cached:

```tsx
import { Suspense } from "react";
import { cookies } from "next/headers";

export default function Page() {
  return (
    <>
      <StaticContent /> {/* Cached, in static shell */}

      {/* Dynamic - needs Suspense */}
      <Suspense fallback={<CartSkeleton />}>
        <UserCart /> {/* Uses cookies() - runtime only */}
      </Suspense>
    </>
  );
}

async function UserCart() {
  const session = (await cookies()).get("session");
  const cart = await fetchCart(session);
  return <Cart items={cart} />;
}
```

### Runtime APIs That Require Suspense

- `cookies()`
- `headers()`
- `searchParams`
- `params` (without `generateStaticParams`)
- `connection()` (explicit defer)

## Caching Flow

```
Build Time:
┌─────────────────────────────────────────┐
│ "use cache" page/function executes      │
│ ↓                                       │
│ Data fetched, transformed               │
│ ↓                                       │
│ Output cached with tags                 │
│ ↓                                       │
│ Static HTML shell generated             │
└─────────────────────────────────────────┘

Runtime (Cache Hit):
┌─────────────────────────────────────────┐
│ Request comes in                        │
│ ↓                                       │
│ Cache entry found                       │
│ ↓                                       │
│ Static HTML served instantly            │
└─────────────────────────────────────────┘

Revalidation:
┌─────────────────────────────────────────┐
│ Webhook triggers revalidateTag()        │
│ ↓                                       │
│ Tag marked stale                        │
│ ↓                                       │
│ Next request: serve stale + refresh BG  │
│ ↓                                       │
│ Subsequent: serve fresh content         │
└─────────────────────────────────────────┘
```

## Best Practices

1. **Use `cacheTag()` for CMS content** - Enables webhook-based revalidation
2. **Choose appropriate `cacheLife()`** - Match content update frequency
3. **Use `"days"` for portfolio content** - Rarely updated, long cache
4. **Use `revalidateTag(tag, "max")`** - Stale-while-revalidate for webhooks
5. **Use `updateTag()`** - Only in Server Actions for immediate updates
6. **Skip Suspense for cached content** - It's already in static shell

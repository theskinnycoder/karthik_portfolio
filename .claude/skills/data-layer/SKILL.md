---
name: data-layer
description: |
  Data fetching, caching, and DAL patterns for Next.js 16 + Sanity CMS.
  Use when: implementing data access layers, adding caching, creating GROQ queries,
  setting up cache revalidation, or working with Sanity schemas.
  Keywords: cache, fetch, DAL, DTO, Sanity, GROQ, cacheTag, cacheLife, revalidate, use cache.
---

# Data Layer Patterns

This skill covers data fetching, caching, and the Data Access Layer (DAL) pattern for Next.js 16 with Sanity CMS.

## Quick Reference

### Three-Layer Caching Strategy

| Layer | API | Purpose |
|-------|-----|---------|
| **Page Level** | `"use cache"` directive | Static generation for entire page |
| **Request Level** | `React.cache()` | Deduplicate requests within same render |
| **Data Level** | `cacheTag()` + `cacheLife()` | Granular control with revalidation tags |

### When to Use What

| Scenario | Approach |
|----------|----------|
| Entire page is static | `"use cache"` at page level |
| Deduplicate requests in same render | `React.cache()` wrapper |
| Control cache duration | `cacheLife("hours")` / `cacheLife("days")` |
| Enable on-demand revalidation | `cacheTag("tag-name")` |
| Show loading UI while fetching | Wrap in `<Suspense fallback={...}>` |
| Immediate cache invalidation (Server Action) | `updateTag("tag-name")` |
| Stale-while-revalidate invalidation | `revalidateTag("tag-name", "max")` |

## DAL Pattern (Data Access Layer)

All Sanity data access flows through a centralized DAL at `src/sanity/lib/dal.ts`.
Cache configuration is centralized in `src/lib/caching.ts`.

### The 6-Step Process

```tsx
// 1. Define GROQ query in queries.ts
export const myQuery = groq`*[_type == "myType"] | order(order asc) {...}`;

// 2. Add to DOCUMENT_TYPE_TO_TAGS in src/lib/caching.ts
export const DOCUMENT_TYPE_TO_TAGS = {
  myType: ["myTypes"],
  // ...
} as const;

// 3. Define Sanity type (raw response shape)
interface SanityMyType {
  _id: string;
  title: string;
  image?: SanityImageSource;
}

// 4. Define DTO (component props shape)
export interface MyTypeDTO {
  title: string;
  imageUrl: string;
}

// 5. Create transformer
function toMyTypeDTO(data: SanityMyType): MyTypeDTO {
  return {
    title: data.title,
    imageUrl: data.image ? urlFor(data.image).url() : "",
  };
}

// 6. Export cached getter using tagResource
export async function getMyTypes(): Promise<MyTypeDTO[]> {
  await tagResource("myType"); // Applies "use cache" + cacheTag + cacheLife

  const data = await sanityFetch<SanityMyType[]>({ query: myQuery });
  return data.map(toMyTypeDTO);
}
```

### Why DTOs?

- **Security**: Only expose safe, minimal data to components
- **Decoupling**: Components don't depend on Sanity schema structure
- **Image URLs**: Transform Sanity image references to usable URLs
- **Type Safety**: Clear interfaces for component props

## Caching Patterns

### Page-Level Caching

For fully static pages, use `cachePageLife()` for consistent cache duration:

```tsx
// src/app/(home)/page.tsx
"use cache";

import { cachePageLife } from "@/lib/caching";

export default async function Page() {
  cachePageLife(); // Applies cacheLife("days") - 1d revalidate, 1w expire

  return <main>...</main>;
}
```

**Important**: Without `cachePageLife()`, the page uses the `default` profile (15m revalidate), which prevents inner caches from extending the cache duration.

### Function-Level Caching (Centralized)

Use the centralized `tagResource` helper from `src/lib/caching.ts`:

```tsx
import { tagResource } from "@/lib/caching";

export async function getData() {
  await tagResource("myType"); // Applies "use cache" + cacheTag + cacheLife("days")

  return fetch(...);
}
```

Or use direct cache APIs for custom behavior:

```tsx
import { cacheLife, cacheTag } from "next/cache";

export async function getData() {
  "use cache";
  cacheLife("hours");     // Custom cache duration
  cacheTag("my-data");    // Enable targeted revalidation

  return fetch(...);
}
```

### Cache Life Profiles

| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| `"default"` | 5m | 15m | 1y |
| `"seconds"` | 30s | 1s | 1m |
| `"minutes"` | 5m | 1m | 1h |
| `"hours"` | 5m | 1h | 1d |
| `"days"` | 5m | 1d | 1w |
| `"weeks"` | 5m | 1w | 30d |
| `"max"` | 5m | 30d | 1y |

### Custom Cache Life

```tsx
import { cacheLife } from "next/cache";

export async function getData() {
  "use cache";
  cacheLife({
    stale: 3600,      // 1 hour until considered stale
    revalidate: 7200, // 2 hours until revalidated
    expire: 86400,    // 1 day until expired
  });

  return fetch(...);
}
```

## Cache Revalidation

### Via Webhook (Sanity CMS Updates)

The webhook route at `src/app/api/revalidate/route.ts` uses centralized cache utilities:

```tsx
import { DOCUMENT_TYPE_TO_TAGS, getTags } from "@/lib/caching";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";

interface SanityWebhookPayload {
  _type: keyof typeof DOCUMENT_TYPE_TO_TAGS;
  _id: string;
}

export async function POST(request: NextRequest) {
  const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
    request,
    process.env.SANITY_WEBHOOK_SECRET,
    true // Add delay for CDN
  );

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const tags = getTags(body._type);
  for (const tag of tags) {
    revalidateTag(tag, "max"); // Stale-while-revalidate
  }

  return NextResponse.json({ revalidated: true, tags });
}
```

### Via Server Action (Immediate)

```tsx
"use server";

import { updateTag } from "next/cache";

export async function updateProduct(id: string, data: FormData) {
  await db.products.update(id, data);
  updateTag("products"); // Immediate invalidation
}
```

## When to Use Suspense

**NOT needed when:**
- All data-fetching uses `"use cache"`
- Content is included in static shell at build time
- No runtime network requests

**IS needed when:**
- User-specific data (cookies, headers, searchParams)
- Real-time data that must be fresh every request
- Content using `connection()` to defer to runtime

```tsx
// Only if you have dynamic content:
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <DynamicComponent /> {/* Uses cookies, headers, etc. */}
    </Suspense>
  );
}
```

## Detailed References

- For detailed Next.js caching patterns, see [NEXTJS-CACHING.md](NEXTJS-CACHING.md)
- For Sanity-specific DAL patterns, see [SANITY-DAL.md](SANITY-DAL.md)

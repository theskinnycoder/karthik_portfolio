# Medium Blog Integration — Design Spec

**Date:** 2026-05-20
**Branch:** `blogs-medium`

---

## Goal

Auto-display Medium articles in the portfolio blogs section via RSS feed. Publishing a new article on Medium automatically adds a card on the next portfolio page load — no manual updates required.

---

## Decisions

| Question | Answer |
|---|---|
| Medium username | `panchalakarthik123` |
| RSS URL | `https://medium.com/feed/@panchalakarthik123` |
| Fetch approach | Async server component (no API route) |
| XML parser | `fast-xml-parser` |
| Cache strategy | `{ cache: "no-store" }` — fresh on every page load |
| Section heading | Hardcoded: `"Blogs"` + `public/smile.png` (from Figma node 246:119) |

---

## Architecture

```
SitePage (server)
  └─ BlogsSection (async server component)
       ├─ fetch medium.com/feed/@panchalakarthik123  { cache: "no-store" }
       ├─ fast-xml-parser → MediumPostDTO[]
       ├─ sort by pubDate desc
       ├─ 0 posts or fetch error → return null (section hidden)
       └─ <Suspense fallback={<BlogsSectionSkeleton />}>
            └─ BlogsSectionInner (async server component)
                 └─ BlogsCarousel (client)
                      └─ BlogCard × N (client, <a> → Medium URL)
```

Server components handle all data fetching. No client-side fetch, no API route, no CORS issues.

---

## Data Contract

```ts
// src/lib/medium.ts
export interface MediumPostDTO {
  title: string;
  link: string;           // Full Medium article URL
  pubDate: string;        // ISO 8601 string
  excerpt: string;        // Plain text, max 200 chars, HTML stripped
  thumbnail: string | null; // First <img src> from content:encoded, or null
}
```

### Thumbnail Extraction

Regex scan `content:encoded` for the first `<img[^>]+src="([^"]+)"`. Fallback: `null`. When null, card shows a dark gradient placeholder with a centered Medium `M` text.

### Excerpt Extraction

Strip all HTML tags from `content:encoded` preview text, normalize whitespace, truncate to 200 characters + ellipsis.

---

## Files

### New Files

| File | Type | Purpose |
|---|---|---|
| `src/lib/medium.ts` | Server utility | Fetch RSS, parse with fast-xml-parser, return `MediumPostDTO[]` |
| `src/app/(site)/(home)/_components/blogs-section/index.tsx` | Async server component | Section wrapper: heading + Suspense |
| `src/app/(site)/(home)/_components/blogs-section/blogs-section-inner.tsx` | Async server component | Fetches posts, renders BlogsCarousel or null |
| `src/app/(site)/(home)/_components/blogs-section/blogs-carousel.tsx` | Client component | Embla + AutoScroll, ProgressiveBlur edges |
| `src/app/(site)/(home)/_components/blogs-section/blog-card.tsx` | Client component | Individual clickable card |
| `src/app/(site)/(home)/_components/blogs-section/blogs-section-skeleton.tsx` | Client component | Shimmer skeleton, 3 cards |

### Modified Files

| File | Change |
|---|---|
| `src/app/(site)/_components/site-page.tsx` | Replace inline `BlogsSection` stub with import from `blogs-section` |

---

## Section Heading

From Figma node 246:119:

```tsx
<h2 className="flex items-center gap-3 font-serif text-4xl text-foreground">
  Blogs
  <Image src="/smile.png" alt="" width={40} height={40} />
</h2>
```

---

## Card UI

Matches portfolio card language (`TestimonialCard` / `ProductCard`):

- Wrapper: `rounded-[18px] border border-border bg-card` + `whileHover={{ scale: 0.98 }}`
- **Top:** cover image (`aspect-[16/9]`, `object-cover`, `rounded-t-[18px]`). If `thumbnail` is null: dark gradient placeholder (`bg-secondary`) with centered `M` in `text-muted-foreground`
- **Body (padded):**
  - Title: `font-semibold text-foreground`, 2-line clamp
  - Excerpt: `text-sm text-muted-foreground`, 3-line clamp
- **Bottom row:**
  - Left: formatted publish date (`MMM D, YYYY`) in `text-xs text-muted-foreground`
  - Right: `"Read on Medium"` label in `text-xs text-muted-foreground` + Medium `M` icon (inline SVG or text)
- Entire card: `<a href={post.link} target="_blank" rel="noopener noreferrer">`

---

## Carousel

Matches `TestimonialsCarousel` exactly:

- Embla Carousel + `embla-carousel-auto-scroll` (already installed)
- `opts`: `align: "start"`, `loop: true`, `dragFree: true`; mobile breakpoint `loop: false`
- AutoScroll: `speed: 1`, `stopOnMouseEnter: true`, active only `(min-width: 768px)`
- Card sizing: `basis-[85%] md:basis-1/2 lg:basis-[45%]`
- `ProgressiveBlur` (8 layers, 0.5 intensity) on left + right edges, desktop only
- Gradient overlays on edges (desktop only)
- Wrapper: `-mx-6 w-[calc(100%+3rem)] md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]`

---

## Skeleton (Suspense Fallback)

Three shimmer cards matching card proportions:
- Shimmer wrapper with `animate-pulse`
- `aspect-[16/9]` image area + two text lines + bottom row
- Same basis/sizing as real cards

---

## Error & Empty States

- If `fetch` throws: catch error, log to console, return `[]`
- If 0 posts returned: `BlogsSection` renders `null` → section disappears from layout
- No error UI shown to users — silent graceful degradation

---

## New Dependency

```bash
bun add fast-xml-parser
```

No other new dependencies. `embla-carousel-auto-scroll` is already installed.

---

## Section Registration

`blogs` is already a key in `HOME_SECTION_KEYS` and `SECTION_CONFIGS` in `site-page.tsx`. No changes needed to the section ordering system.

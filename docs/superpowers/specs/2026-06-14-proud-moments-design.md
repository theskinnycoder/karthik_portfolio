# Proud Moments — Design Spec

**Date:** 2026-06-14  
**Status:** Approved

---

## Overview

A new homepage section called **"Proud Moments"** that displays a list of personal highlights (awards, publications, shipped milestones, etc.). Each item is clickable and opens a rich-text detail page — identical navigation pattern to the Work section (vaul bottom-sheet drawer on click, full page on direct URL).

---

## Card Layout

**Compact horizontal list**, large size variant:

- **Thumbnail** — 120×94 px, 4:3 ratio, rounded corners, Cloudinary image
- **Date pill** — inline badge (e.g. "Jun 2024"), shown above the title
- **Title** — 20px, font-weight 600, color `foreground`
- **Description** — 11–12px, color `muted-foreground`, line-height 1.5
- **Arrow chevron** — right-aligned, `muted-foreground`, indicates clickability
- **Divider** — 1px border between items, no divider after the last item
- Items ordered newest-first by `date` (ISO date field); `order` number overrides

The section always renders a visible **"Proud Moments" section heading** above the list, driven by the Sanity `sectionHeader` document (same as Experience, Work, Blogs).

---

## Detail Page

Clicking a card slides up a vaul drawer with:

```
← Back                      (DrawerBackHeader)

[Full-width card image]     (auto-rendered as hero — no need to re-add in rich text)

Title                       (large, ~28–32px)
Jun 2024                    (date pill)

[PortableText content]      (same block types as workItem)

← Previous  |  Next →      (prev/next nav, same component as work)
```

Direct URL (`/proud-moments/[slug]`) renders the identical layout as a full page.

---

## Sanity Schema — `highlight` document type

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required |
| `description` | string | One-liner on the card |
| `date` | date | Required; drives sort order |
| `image` | cloudinary.asset | Required; card thumb + detail hero |
| `content` | array | Same rich-text blocks as `workItem` |
| `slug` | slug | Source: title; required |
| `order` | number | Manual sort override; default 0 |

`content` block types (reused from workItem): `articleBlock`, `contentImage`, `contentTestimonial`, `contentMeta`, `contentBadges`, `contentTable`, `contentDivider`, `contentVideo`, `contentBlog`.

---

## Routing

Mirrors the work section exactly:

| Route | Purpose |
|---|---|
| `(site)/@modal/(.)proud-moments/[slug]` | Intercepts click → vaul drawer |
| `(proud-moment-detail)/proud-moments/[slug]` | Direct URL → full page |
| `(site)/proud-moments/page.tsx` | Section deep-link (like `/work`) |

---

## Data Layer (DAL additions)

**DTOs:**

```ts
interface HighlightCardDTO {
  title: string;
  description: string;
  date: string;       // ISO date string
  image: string;      // Cloudinary URL
  slug: string;
}

interface HighlightDetailDTO {
  title: string;
  description: string;
  date: string;
  image: string;
  content: PortableTextBlock[];
  prev: HighlightNavLinkDTO | null;
  next: HighlightNavLinkDTO | null;
  slug: string;
}

interface HighlightNavLinkDTO {
  title: string;
  slug: string;
}
```

**Functions:**
- `getHighlights()` — card list, ordered by `date` desc then `order` asc
- `getHighlightBySlug(slug)` — detail + prev/next links
- `getAllHighlightSlugs()` — for `generateStaticParams`

---

## Caching

- Add `highlight: ["highlights"]` to `DOCUMENT_TYPE_TO_TAGS` in `src/lib/caching.ts`
- Use `cacheSanityResource("highlight")` in DAL functions
- Add `highlight` to Sanity webhook filter in the Dashboard

---

## File Structure

```
src/
  sanity/
    schemaTypes/
      highlight.ts                          # NEW — Sanity document schema
      index.ts                              # add highlight export

  lib/
    caching.ts                              # add highlight tag
    home-sections.ts                        # add "proudMoments" key

  sanity/lib/
    queries.ts                              # add highlight queries
    dal.ts                                  # add DTOs + functions

  app/
    (site)/
      _components/site-page.tsx             # add proudMoments to SECTION_CONFIGS
      (home)/
        _components/
          proud-moments-section/
            index.tsx                       # async server component
            proud-moment-card.tsx           # client card row
      proud-moments/
        page.tsx                            # deep-link page
      @modal/
        (.)proud-moments/[slug]/
          page.tsx                          # modal page (server)
          loading.tsx                       # skeleton
          _components/
            proud-moment-modal-drawer.tsx   # vaul drawer

    (proud-moment-detail)/
      layout.tsx                            # pass-through
      proud-moments/[slug]/
        page.tsx                            # full-page (server)
        _components/
          proud-moment-article.tsx          # title + date + image + PortableText
          proud-moment-detail-drawer-shell.tsx
```

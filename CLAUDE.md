# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun dev              # Start dev server with Turbopack
bun run studio       # Run Sanity Studio at /studio

# Code Quality
bun run lint:check   # Check ESLint violations
bun run lint:fix     # Fix ESLint violations
bun run format:check # Check Prettier formatting
bun run format:fix   # Auto-format with Prettier
bun run typecheck    # TypeScript type checking

# Production
bun run build        # Build for production
bun start            # Run production server

# Sanity CMS
bun run sanity:deploy        # Deploy studio to cloud
bun run sanity:schema:deploy # Deploy schema to cloud
bun run sanity:typegen       # Generate TypeScript types

# shadcn Components
bunx --bun shadcn@latest add <component_name>  # Install shadcn component
```

## Architecture

**Stack:** Next.js 16 (App Router, Cache Components) + React 19 + TypeScript + Tailwind CSS v4 + Sanity CMS

**Path alias:** `@/*` maps to `./src/*`

### Key Directories

- `src/app/` - App Router pages and layouts (route groups use parentheses, e.g., `(home)`)
- `src/app/(home)/_components/` - Page-specific components organized by section
- `src/components/ui/` - Reusable shadcn-style UI components
- `src/lib/` - Utilities (`utils.ts` has `cn()` helper, `fonts.ts` has font config, `caching.ts` has cache utilities)
- `src/sanity/` - Sanity CMS integration
  - `schemaTypes/` - Document schema definitions
  - `lib/` - Client, DAL, queries, image helpers
  - `plugins/` - Custom plugins (Vercel Blob asset source)
- `public/` - Static assets (SVG logos, icons)

### Routes

| Route                 | Description             | Type            |
| --------------------- | ----------------------- | --------------- |
| `/`                   | Home page               | Static (cached) |
| `/studio/[[...tool]]` | Sanity Studio           | Client-side     |
| `/api/revalidate`     | Sanity webhook endpoint | API Route       |
| `/api/upload`         | Vercel Blob upload      | API Route       |

## Sanity CMS

**Studio URL:** `/studio` (embedded in Next.js app)

### Directory Structure

```
src/sanity/
├── schemaTypes/       # Document type definitions
│   └── index.ts       # Schema exports
├── lib/
│   ├── client.ts      # Sanity client
│   ├── env.ts         # Environment config
│   ├── fetch.ts       # Fetch wrapper
│   ├── queries.ts     # GROQ queries
│   ├── dal.ts         # Data Access Layer
│   └── image.ts       # Image URL builder
├── plugins/           # Custom plugins (Vercel Blob asset source)
└── structure.ts       # Studio desk structure
```

### Data Access Layer Pattern

All Sanity data flows through the DAL (`src/sanity/lib/dal.ts`):

1. **Define GROQ query** in `queries.ts`
2. **Create raw Sanity type** matching query response
3. **Create DTO interface** matching component props
4. **Write transformer** (Sanity → DTO, including image URLs via `urlFor()`)
5. **Export async function** using `tagResource()` for caching

```tsx
// queries.ts
export const myQuery = groq`*[_type == "myType"] | order(order asc) {...}`;

// dal.ts
interface SanityMyType {
	/* raw response shape */
}
export interface MyTypeDTO {
	/* component props shape */
}

function toMyTypeDTO(data: SanityMyType): MyTypeDTO {
	return {
		// Transform fields, convert images: urlFor(data.image).url()
	};
}

export async function getMyTypes(): Promise<MyTypeDTO[]> {
	await tagResource("myType"); // Applies "use cache" + cacheTag + cacheLife

	const data = await sanityFetch<SanityMyType[]>({
		query: myQuery,
	});
	return data.map(toMyTypeDTO);
}
```

### Adding New Content Types

1. Create schema in `src/sanity/schemaTypes/newType.ts`
2. Export from `schemaTypes/index.ts`
3. Add GROQ query to `queries.ts`
4. Add document type to `DOCUMENT_TYPE_TO_TAGS` in `src/lib/caching.ts`
5. Add Sanity type, DTO, transformer, and getter to `dal.ts`
6. Deploy schema: `bun run sanity:schema:deploy`

## Caching

### Centralized Cache Utilities

All caching configuration is in `src/lib/caching.ts`:

```tsx
// Default cache life profile (revalidate: 1 day, expire: 1 week)
export const CACHE_LIFE = "days" as const;

// Document type to cache tag mapping
export const DOCUMENT_TYPE_TO_TAGS = {
	testimonial: ["testimonials"],
	company: ["companies"],
} as const;

// Page-level cache life helper
export function cachePageLife() {
	cacheLife(CACHE_LIFE);
}

// DAL-level cache helper with "use cache" + cacheTag + cacheLife
export async function tagResource(type: keyof typeof DOCUMENT_TYPE_TO_TAGS) {
	"use cache";
	cacheLife(CACHE_LIFE);
	cacheTag(getTags(type)[0]);
}
```

### Page-Level Caching

Pages use `"use cache"` directive with `cachePageLife()` for consistent cache duration:

```tsx
"use cache";

import { cachePageLife } from "@/lib/caching";

export default async function Page() {
	cachePageLife(); // Applies cacheLife("days")

	return <main>...</main>;
}
```

### Usage in DAL

```tsx
export async function getTestimonials() {
	await tagResource("testimonial"); // Applies caching

	const testimonials = await sanityFetch<SanityTestimonial[]>({
		query: testimonialsQuery,
	});
	return testimonials.map(toTestimonialDTO);
}
```

### Webhook Revalidation

Sanity webhook triggers `/api/revalidate` to invalidate cache tags:

```tsx
// POST /api/revalidate
revalidateTag(tag, "max"); // Stale-while-revalidate behavior
```

Configure webhook in Sanity Dashboard (sanity.io/manage):

- **URL:** `https://your-domain.com/api/revalidate`
- **Trigger:** Create, Update, Delete
- **Filter:** `_type in ["testimonial", "company"]`
- **Projection:** `{_type, _id}`
- **Secret:** Set in `SANITY_WEBHOOK_SECRET` env var

## Component Patterns

**CVA for variants** - Use `class-variance-authority` for component variants:

```tsx
const buttonVariants = cva("base-classes", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" }
});
```

**cn() for class merging** - Always use `cn()` from `@/lib/utils` for className composition:

```tsx
className={cn("base-classes", conditional && "conditional-class", className)}
```

**data-slot attributes** - UI components use `data-slot` for semantic styling hooks

**Section-based organization** - Group related components in directories with `index.tsx` as the main export:

```
_components/
├── intro-section/
│   ├── index.tsx           # Main section component
│   ├── hero-section.tsx
│   ├── about-section.tsx
│   └── social-links-section.tsx
```

**Async Server Components** - Fetch data directly in components:

```tsx
export async function MySection() {
	const data = await getData();
	return <div>{/* render data */}</div>;
}
```

**Static data with type safety** - Use `satisfies` for type inference or `as const` for immutable arrays:

```tsx
const links = [{ label: "LinkedIn", href: "..." }] satisfies LinkType[];
const items = [{ src: "/logo.svg", alt: "Logo" }] as const;
```

**Inline text highlighting** - Use a `Highlight` component for emphasized text within paragraphs:

```tsx
function Highlight({ children }: { children: React.ReactNode }) {
	return <span className="font-medium text-foreground">{children}</span>;
}
```

**Images and icons** - Use `next/image` for all images including SVG icons from `/public`:

```tsx
<Image
	src="/linkedin-logo.svg"
	alt="LinkedIn"
	width={18}
	height={18}
/>
```

## Styling

- **Dark theme only** using OKLCH color space
- **CSS variables** defined in `globals.css` under `:root` and `@theme inline` (with hex comments for reference)
- **Tailwind v4** with `@tailwindcss/postcss` (not traditional config file)
- **Use semantic tokens** - Prefer `text-muted-foreground` over arbitrary colors like `text-[#ccc]`
- Icons from `lucide-react` for UI components; custom SVGs in `/public` for brand logos

## Code Style

- **Tabs** for indentation (width 2)
- **Double quotes** for strings
- **Trailing commas** in all contexts
- **Semicolons** required
- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`

## MCP Servers

Configured in `.mcp.json`:

- `shadcn` - Component installation
- `figma-desktop` - Figma integration (localhost:3845)
- `context7` - Documentation lookup
- `next-devtools` - Next.js debugging and runtime tools
- `vercel` - Vercel deployment and project management
- `sanity` - Sanity CMS operations (requires `SANITY_MCP_TOKEN` in `.claude/settings.json`)

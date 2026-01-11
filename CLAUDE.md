# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun dev              # Start dev server with Turbopack

# Code Quality
bun run lint:check   # Check ESLint violations
bun run lint:fix     # Fix ESLint violations
bun run format:check # Check Prettier formatting
bun run format:fix   # Auto-format with Prettier
bun run typecheck    # TypeScript type checking

# Production
bun run build        # Build for production
bun start            # Run production server

# shadcn Components
bunx --bun shadcn@latest add <component_name>  # Install shadcn component
```

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4

**Path alias:** `@/*` maps to `./src/*`

### Key Directories

- `src/app/` - App Router pages and layouts (route groups use parentheses, e.g., `(home)`)
- `src/app/(home)/_components/` - Page-specific components organized by section (e.g., `intro-section/`, `experience-section/`)
- `src/components/ui/` - Reusable shadcn-style UI components
- `src/lib/` - Utilities (`utils.ts` has `cn()` helper, `fonts.ts` has font config)
- `public/` - Static assets including SVG logos (e.g., `apxor-logo.svg`, `linkedin-logo.svg`)

### Component Patterns

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

### Styling

- **Dark theme only** using OKLCH color space
- **CSS variables** defined in `globals.css` under `:root` and `@theme inline` (with hex comments for reference)
- **Tailwind v4** with `@tailwindcss/postcss` (not traditional config file)
- **Use semantic tokens** - Prefer `text-muted-foreground` over arbitrary colors like `text-[#ccc]`
- Icons from `lucide-react` for UI components; custom SVGs in `/public` for brand logos

### Page Patterns

- **Cache directive** - Use `"use cache"` at the top of page files for static generation:

```tsx
"use cache";

export default async function Page() { ... }
```

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

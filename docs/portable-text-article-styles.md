# Portable Text article styles

This document is the reference for how prose text renders on `/work/[slug]`. It describes what the renderer pins versus what authors control from Studio.

## Philosophy

Three things live in code, everything else is author-driven:

1. **Responsive sizes** (rem, by element)
2. **Heading margins** (Figma-tuned)
3. **Structural chrome** — blockquote's coral divider, link underline, HR color, font family

Weights and colors fall through the Tailwind Typography plugin's defaults. Authors override per-span or per-block using three PortableText annotations exposed in the Studio toolbar:

- **Color** (`textColor` — `@sanity/color-input` picker)
- **Weight** (`fontWeight` — Light 300 / Regular 400 / Medium 500 / Semibold 600 / Bold 700)
- **Family** (`fontFamily` — Inter Tight / Caveat)

Annotations emit inline `style` attributes, which beat any class-based CSS in the prose shell. Authors always win.

## Decorators

| Decorator | Value       | Renders as         |
| --------- | ----------- | ------------------ |
| Italic    | `em`        | `<em>`             |
| Strike    | `s`         | `<s>`              |
| Underline | `underline` | `<u>` (via plugin) |

Bold / strong is intentionally **not** a decorator — use the `fontWeight` annotation (500/600/700) instead. Inline code is not supported.

## Size scale

All sizes use `rem` (base `16px`) and bump across two breakpoints. Mobile values are lifted from the Figma mobile wireframe; `md` / `lg` are extrapolated to follow the `prose-sm → prose-base → prose-lg` shape.

| Element           | mobile             | `md` (≥768px)      | `lg` (≥1024px)     |
| ----------------- | ------------------ | ------------------ | ------------------ |
| `p`, `blockquote` | `0.875rem` (14px)  | `0.9375rem` (15px) | `1rem` (16px)      |
| `h1`              | `1.0625rem` (17px) | `1.25rem` (20px)   | `1.5rem` (24px)    |
| `h2`              | `1rem` (16px)      | `1.125rem` (18px)  | `1.25rem` (20px)   |
| `h3`              | `0.875rem` (14px)  | `1rem` (16px)      | `1.125rem` (18px)  |
| `h4`              | `0.875rem` (14px)  | `0.9375rem` (15px) | `1rem` (16px)      |
| `h5`              | `0.8125rem` (13px) | `0.875rem` (14px)  | `0.9375rem` (15px) |
| `h6`              | `0.75rem` (12px)   | `0.8125rem` (13px) | `0.875rem` (14px)  |

Hierarchy `body ≤ h6 < h5 < h4 < h3 < h2 < h1` holds at every breakpoint.

## Heading margins

Using Tailwind's default spacing scale (`mt-N` / `mb-N` where `N × 0.25rem`):

| Element | `margin-top`    | `margin-bottom`  |
| ------- | --------------- | ---------------- |
| `h1`    | `0`             | `1.5rem` (24px)  |
| `h2`    | `2rem` (32px)   | `1rem` (16px)    |
| `h3`    | `1.5rem` (24px) | `0.75rem` (12px) |
| `h4`    | `1.5rem` (24px) | `0.5rem` (8px)   |
| `h5`    | `1rem` (16px)   | `0.5rem` (8px)   |
| `h6`    | `1rem` (16px)   | `0.5rem` (8px)   |

Paragraph / blockquote / list margins fall through to plugin defaults.

## Blockquote

Text styling (size / weight / color) follows the author-driven model like any other element. Only the structure is pinned:

- `margin: 1.5rem 0`
- `padding-left: 0.75rem`
- `border-left: 2px solid var(--brand-primary, var(--accent-coral))` — per-case-study brand color if set, coral fallback otherwise
- `font-style: normal` (plugin default is italic; we opt out)

## Font family

The article wrapper sets `font-sans` (Inter Tight via `--font-sans`). Every prose element inherits unless the author applies a `fontFamily` annotation on a span. Caveat (`var(--font-serif)`) is available as a selectable family for decorative moments.

## Colors

No prose element has a pinned color. Everything inherits `text-foreground` from the `data-theme="work-detail"` wrapper by default. Authors apply a `textColor` annotation to override per-span.

## Line heights

Not overridden. Plugin defaults apply per element.

## Meta panel

`contentMeta` follows the same responsive rem scale (`14px → 15px → 16px`) for both labels and values. Labels use `font-semibold` + `text-foreground`, values use `font-normal` + `text-muted-foreground`. This is a separate component (`src/components/portable-text/blocks/content-meta.tsx`), not part of the prose shell, but kept in lockstep with the scale here for visual consistency.

## Where the code lives

| Concern                                                                                              | File                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Responsive sizes, margins, blockquote chrome, links, HR                                              | `src/components/portable-text/portable-text-renderer.tsx` (the `ARTICLE_PROSE` constant) |
| Annotation mark components (`textColor`, `fontWeight`, `fontFamily`, `link`)                         | `src/components/portable-text/article-components.tsx`                                    |
| Custom block components (`contentImage`, `contentMeta`, etc.)                                        | `src/components/portable-text/blocks/`                                                   |
| Schema definition (decorators + annotations + block types)                                           | `src/sanity/schemaTypes/workItem.ts`                                                     |
| Theme tokens (`--foreground`, `--muted-foreground`, `--accent-coral`, `--font-sans`, `--font-serif`) | `src/app/globals.css`                                                                    |
| Font registration                                                                                    | `src/lib/fonts.ts`                                                                       |
| Color-input plugin registration                                                                      | `sanity.config.ts`                                                                       |

## Adding a new text treatment

If you need a one-off text style that doesn't fit the default scale (e.g. a decorative pull-quote or a display callout), prefer a new **block type** (like `contentMeta`) over a new prose modifier. Block types keep the prose shell small and let authors pick them from the insert menu.

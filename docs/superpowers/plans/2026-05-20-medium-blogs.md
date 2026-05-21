# Medium Blog Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-display Medium articles as a scrollable carousel in the portfolio blogs section — new posts appear on next page load, zero manual work.

**Architecture:** Async server component fetches Medium RSS directly (no API route, no CORS issue), parses XML with `fast-xml-parser`, passes a typed `MediumPostDTO[]` to a client-side Embla carousel that mirrors the existing `TestimonialsCarousel` pattern. A `Suspense` boundary with a shimmer skeleton handles streaming.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · `fast-xml-parser` · `embla-carousel-auto-scroll` (already installed) · `motion`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| **Create** | `src/lib/medium.ts` | Fetch RSS, parse XML, return `MediumPostDTO[]` |
| **Create** | `src/app/(site)/(home)/_components/blogs-section/index.tsx` | Section heading + Suspense boundary |
| **Create** | `src/app/(site)/(home)/_components/blogs-section/blogs-section-inner.tsx` | Async server component — fetch posts, render carousel or null |
| **Create** | `src/app/(site)/(home)/_components/blogs-section/blogs-carousel.tsx` | Embla + AutoScroll + ProgressiveBlur (client) |
| **Create** | `src/app/(site)/(home)/_components/blogs-section/blog-card.tsx` | Clickable card UI (client) |
| **Create** | `src/app/(site)/(home)/_components/blogs-section/blogs-section-skeleton.tsx` | Shimmer skeleton (client) |
| **Modify** | `src/app/(site)/_components/site-page.tsx` | Replace inline stub, update section className |

---

## Task 1: Install `fast-xml-parser`

**Files:** `package.json`, `bun.lock`

- [ ] **Step 1: Install the package**

```bash
cd C:/Users/panch/karthik_portfolio && bun add fast-xml-parser
```

Expected output: `+ fast-xml-parser@X.X.X`

- [ ] **Step 2: Verify it appears in dependencies**

```bash
grep "fast-xml-parser" package.json
```

Expected: `"fast-xml-parser": "^4.x.x"` in the `dependencies` block.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: add fast-xml-parser for Medium RSS parsing"
```

---

## Task 2: Create `src/lib/medium.ts` — RSS Utility

**Files:**
- Create: `src/lib/medium.ts`

This module is the single source of truth for all Medium data. It exports one public function (`getMediumPosts`) and one type (`MediumPostDTO`).

- [ ] **Step 1: Create the file**

Create `src/lib/medium.ts` with the following content:

```ts
import { XMLParser } from "fast-xml-parser";

export interface MediumPostDTO {
	title: string;
	link: string;
	pubDate: string; // ISO 8601
	excerpt: string; // Plain text, max ~200 chars
	thumbnail: string | null; // First image from content:encoded, or null
}

const MEDIUM_RSS_URL = "https://medium.com/feed/@panchalakarthik123";

/** Extract the first image src from Medium's content:encoded HTML */
function extractThumbnail(html: string): string | null {
	const match = html.match(/<img[^>]+src="([^"]+)"/);
	return match?.[1] ?? null;
}

/** Strip HTML tags and truncate to ~200 chars */
function extractExcerpt(html: string): string {
	const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	if (plain.length <= 200) return plain;
	// Truncate at a word boundary
	return plain.slice(0, 200).replace(/\s+\S*$/, "") + "…";
}

/** Fetch and parse the Medium RSS feed. Returns [] on any error. */
export async function getMediumPosts(): Promise<MediumPostDTO[]> {
	try {
		const response = await fetch(MEDIUM_RSS_URL, { cache: "no-store" });
		if (!response.ok) return [];

		const xml = await response.text();

		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
			// Preserve CDATA content (Medium wraps HTML in CDATA)
			cdataPropName: "__cdata",
		});
		const parsed = parser.parse(xml) as {
			rss?: { channel?: { item?: unknown } };
		};

		const rawItems = parsed?.rss?.channel?.item;
		// fast-xml-parser returns a single object (not array) when there is only one item
		const items: unknown[] = Array.isArray(rawItems)
			? rawItems
			: rawItems
				? [rawItems]
				: [];

		const posts: MediumPostDTO[] = items.map((item) => {
			const i = item as Record<string, unknown>;

			// content:encoded may be wrapped in __cdata by the parser
			const rawContent = i["content:encoded"];
			const contentEncoded =
				typeof rawContent === "object" && rawContent !== null
					? String((rawContent as Record<string, unknown>)["__cdata"] ?? "")
					: String(rawContent ?? "");

			// description is a shorter HTML excerpt Medium provides
			const rawDesc = i.description;
			const description =
				typeof rawDesc === "object" && rawDesc !== null
					? String((rawDesc as Record<string, unknown>)["__cdata"] ?? "")
					: String(rawDesc ?? "");

			const excerptSource = description || contentEncoded;

			return {
				title: String(i.title ?? "").trim(),
				link: String(i.link ?? i.guid ?? "").trim(),
				pubDate: new Date(String(i.pubDate ?? "")).toISOString(),
				excerpt: extractExcerpt(excerptSource),
				thumbnail: extractThumbnail(contentEncoded),
			};
		});

		// Newest first
		return posts.sort(
			(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
		);
	} catch (error) {
		console.error("[medium] Failed to fetch RSS feed:", error);
		return [];
	}
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

Expected: No errors related to `src/lib/medium.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/medium.ts
git commit -m "feat: add Medium RSS fetch utility with MediumPostDTO type"
```

---

## Task 3: Create `blog-card.tsx` — Card Component

**Files:**
- Create: `src/app/(site)/(home)/_components/blogs-section/blog-card.tsx`

Each card is a full `<a>` element opening the Medium article in a new tab. Visual language matches `TestimonialCard`: `rounded-[18px] border border-border`, `whileHover={{ scale: 0.98 }}`.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import type { MediumPostDTO } from "@/lib/medium";
import { motion } from "motion/react";

interface BlogCardProps {
	post: MediumPostDTO;
}

function MediumIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}
		>
			<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
		</svg>
	);
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function BlogCard({ post }: BlogCardProps) {
	return (
		<a
			href={post.link}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-full"
			aria-label={`Read "${post.title}" on Medium`}
		>
			<motion.div
				className="flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-card"
				whileHover={{ scale: 0.98 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				{/* Cover image */}
				{post.thumbnail ? (
					<div className="aspect-[16/9] w-full overflow-hidden">
						<img
							src={post.thumbnail}
							alt=""
							loading="lazy"
							className="h-full w-full object-cover"
						/>
					</div>
				) : (
					<div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary">
						<MediumIcon className="size-10 text-muted-foreground/40" />
					</div>
				)}

				{/* Body */}
				<div className="flex flex-1 flex-col gap-2 p-4">
					<h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
						{post.title}
					</h3>
					<p className="line-clamp-3 flex-1 text-sm font-light text-muted-foreground">
						{post.excerpt}
					</p>

					{/* Footer row */}
					<div className="mt-1 flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							{formatDate(post.pubDate)}
						</span>
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<MediumIcon className="size-3" />
							<span>Read on Medium</span>
						</div>
					</div>
				</div>
			</motion.div>
		</a>
	);
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(site\)/\(home\)/_components/blogs-section/blog-card.tsx
git commit -m "feat: add BlogCard component for Medium posts"
```

---

## Task 4: Create `blogs-carousel.tsx` — Embla Carousel

**Files:**
- Create: `src/app/(site)/(home)/_components/blogs-section/blogs-carousel.tsx`

Mirrors `TestimonialsCarousel` exactly — same AutoScroll config, same ProgressiveBlur edges, same responsive card basis sizing.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { MediumPostDTO } from "@/lib/medium";
import { BlogCard } from "./blog-card";

interface BlogsCarouselProps {
	posts: MediumPostDTO[];
}

export function BlogsCarousel({ posts }: BlogsCarouselProps) {
	const plugin = React.useRef(
		AutoScroll({
			speed: 1,
			startDelay: 0,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			active: false,
			breakpoints: {
				"(min-width: 768px)": { active: true },
			},
		}),
	);

	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				opts={{
					align: "start",
					loop: true,
					dragFree: true,
					breakpoints: {
						"(max-width: 767px)": { loop: false },
					},
				}}
				plugins={[plugin.current]}
				className="w-full"
			>
				<CarouselContent className="items-stretch">
					{posts.map((post, index) => (
						<CarouselItem
							key={`${post.link}-${index}`}
							className="basis-[85%] md:basis-1/2 lg:basis-[45%]"
						>
							<BlogCard post={post} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Edge fades — desktop only */}
			<ProgressiveBlur
				direction="left"
				blurLayers={8}
				blurIntensity={0.5}
				className="absolute inset-y-0 left-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8 bg-gradient-to-r from-background to-transparent md:block" />
			<ProgressiveBlur
				direction="right"
				blurLayers={8}
				blurIntensity={0.5}
				className="absolute inset-y-0 right-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-gradient-to-l from-background to-transparent md:block" />
		</div>
	);
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(site\)/\(home\)/_components/blogs-section/blogs-carousel.tsx
git commit -m "feat: add BlogsCarousel with Embla + AutoScroll, mirroring TestimonialsCarousel"
```

---

## Task 5: Create `blogs-section-skeleton.tsx` — Loading State

**Files:**
- Create: `src/app/(site)/(home)/_components/blogs-section/blogs-section-skeleton.tsx`

Shown as the `Suspense` fallback while the server fetches the RSS feed. Three cards, shimmer animation, matching card proportions.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

function SkeletonCard() {
	return (
		<div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[18px] border border-border bg-card">
			{/* Image placeholder */}
			<div className="aspect-[16/9] w-full bg-muted" />

			{/* Body */}
			<div className="flex flex-1 flex-col gap-3 p-4">
				{/* Title lines */}
				<div className="h-4 w-3/4 rounded bg-muted" />
				<div className="h-4 w-1/2 rounded bg-muted" />

				{/* Excerpt lines */}
				<div className="flex-1 space-y-2 pt-1">
					<div className="h-3 w-full rounded bg-muted" />
					<div className="h-3 w-full rounded bg-muted" />
					<div className="h-3 w-2/3 rounded bg-muted" />
				</div>

				{/* Footer */}
				<div className="flex justify-between pt-1">
					<div className="h-3 w-16 rounded bg-muted" />
					<div className="h-3 w-24 rounded bg-muted" />
				</div>
			</div>
		</div>
	);
}

export function BlogsSectionSkeleton() {
	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="items-stretch">
					{[0, 1, 2].map((i) => (
						<CarouselItem
							key={i}
							className="basis-[85%] md:basis-1/2 lg:basis-[45%]"
						>
							<SkeletonCard />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(site\)/\(home\)/_components/blogs-section/blogs-section-skeleton.tsx
git commit -m "feat: add BlogsSectionSkeleton shimmer loading state"
```

---

## Task 6: Create `blogs-section-inner.tsx` — Data-Fetching Server Component

**Files:**
- Create: `src/app/(site)/(home)/_components/blogs-section/blogs-section-inner.tsx`

This is the async component that `Suspense` wraps. It is separate from `index.tsx` so the heading renders immediately while this component streams in. Returns `null` if there are no posts (hides the section silently).

- [ ] **Step 1: Create the file**

```tsx
import { getMediumPosts } from "@/lib/medium";
import { BlogsCarousel } from "./blogs-carousel";

export async function BlogsSectionInner() {
	const posts = await getMediumPosts();

	if (posts.length === 0) return null;

	return <BlogsCarousel posts={posts} />;
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(site\)/\(home\)/_components/blogs-section/blogs-section-inner.tsx
git commit -m "feat: add BlogsSectionInner async server component"
```

---

## Task 7: Create `blogs-section/index.tsx` — Section Wrapper

**Files:**
- Create: `src/app/(site)/(home)/_components/blogs-section/index.tsx`

Renders the hardcoded heading (from Figma node 246:119: `"Blogs"` + `smile.png` 40×40px) and wraps `BlogsSectionInner` in a `Suspense` boundary with the skeleton fallback.

- [ ] **Step 1: Create the file**

```tsx
import Image from "next/image";
import { Suspense } from "react";
import { BlogsSectionInner } from "./blogs-section-inner";
import { BlogsSectionSkeleton } from "./blogs-section-skeleton";

export function BlogsSection() {
	return (
		<section className="flex flex-col items-center gap-7">
			<div className="flex w-full items-center gap-3">
				<h2 className="font-serif text-4xl text-foreground">Blogs</h2>
				<Image
					src="/smile.png"
					alt=""
					width={40}
					height={40}
					loading="eager"
				/>
			</div>

			<Suspense fallback={<BlogsSectionSkeleton />}>
				<BlogsSectionInner />
			</Suspense>
		</section>
	);
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(site\)/\(home\)/_components/blogs-section/index.tsx
git commit -m "feat: add BlogsSection wrapper with Figma heading and Suspense boundary"
```

---

## Task 8: Wire Up in `site-page.tsx`

**Files:**
- Modify: `src/app/(site)/_components/site-page.tsx`

Two changes:
1. Remove the inline `BlogsSection` stub function.
2. Import the new `BlogsSection` from `blogs-section`.
3. Update the `blogs` entry in `SECTION_CONFIGS` — remove `h-dvh`/`justify-center` (the stub needed those to center "Work in progress!"; the real component handles its own layout). Match the testimonials className.

- [ ] **Step 1: Open `src/app/(site)/_components/site-page.tsx` and make the following edits**

**Remove** the inline stub (lines ~12–19 in the current file):
```tsx
// DELETE THIS ENTIRE FUNCTION:
function BlogsSection() {
	return (
		<>
			<h1 className="font-serif text-4xl">Blogs</h1>
			<p className="text-xl text-muted-foreground">Work in progress!</p>
		</>
	);
}
```

**Add** the import at the top of the file (alongside other section imports):
```tsx
import { BlogsSection } from "./(home)/_components/blogs-section";
```

**Update** the `blogs` entry in `SECTION_CONFIGS`:

Old:
```tsx
blogs: {
    id: "blogs",
    className:
        "mx-auto flex h-dvh w-full max-w-5xl flex-col items-center justify-center gap-2 px-6 md:px-11",
    Component: BlogsSection,
},
```

New:
```tsx
blogs: {
    id: "blogs",
    className:
        "mx-auto w-full max-w-5xl px-6 md:px-[1.125rem]",
    Component: BlogsSection,
},
```

- [ ] **Step 2: TypeScript check — all files**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck 2>&1 | head -50
```

Expected: Zero errors.

- [ ] **Step 3: Lint check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run lint:check 2>&1 | head -50
```

Expected: Zero errors (fix any that appear before committing).

- [ ] **Step 4: Commit**

```bash
git add src/app/\(site\)/_components/site-page.tsx
git commit -m "feat: wire BlogsSection into SitePage, replacing Work in progress stub"
```

---

## Task 9: Visual Smoke Test

**Goal:** Confirm the carousel renders correctly on desktop and mobile, cards are clickable, skeleton shows briefly, and the section hides gracefully when there are no posts.

- [ ] **Step 1: Start the dev server**

```bash
cd C:/Users/panch/karthik_portfolio && bun dev
```

Wait for `Ready` message.

- [ ] **Step 2: Navigate to the Blogs section**

Open `http://localhost:3000` in a browser, scroll to the Blogs section (or open `http://localhost:3000/blogs`).

**Checklist:**
- [ ] Heading "Blogs" + smile emoji icon appears
- [ ] Cards render with cover image (or dark placeholder if no thumbnail)
- [ ] Card title is readable (2-line clamp working)
- [ ] Excerpt shows as muted grey text
- [ ] Date + "Read on Medium" footer visible
- [ ] Clicking a card opens the Medium article in a new tab
- [ ] Hover: card scales down slightly (`scale: 0.98`)
- [ ] Desktop: cards auto-scroll smoothly, ProgressiveBlur edges visible
- [ ] Mobile (resize to 375px): swipe works, no auto-scroll, no blur edges

- [ ] **Step 3: Test empty state**

Temporarily change `MEDIUM_RSS_URL` in `src/lib/medium.ts` to a broken URL:
```ts
const MEDIUM_RSS_URL = "https://medium.com/feed/@__nonexistent__9999";
```

Reload the page. The blogs section should disappear entirely (no broken UI, no error message).

Revert the URL after testing:
```ts
const MEDIUM_RSS_URL = "https://medium.com/feed/@panchalakarthik123";
```

- [ ] **Step 4: Final commit (if any fixes were made)**

```bash
git add -p
git commit -m "fix: smoke test fixes for Medium blog section"
```

---

## Task 10: Format & Final Lint Pass

- [ ] **Step 1: Auto-format all new files**

```bash
cd C:/Users/panch/karthik_portfolio && bun run format:fix
```

- [ ] **Step 2: Final lint check**

```bash
cd C:/Users/panch/karthik_portfolio && bun run lint:check
```

Expected: Zero violations.

- [ ] **Step 3: Final typecheck**

```bash
cd C:/Users/panch/karthik_portfolio && bun run typecheck
```

Expected: Zero errors.

- [ ] **Step 4: Commit formatting changes if any**

```bash
git add -p
git commit -m "style: apply prettier formatting to blogs section files"
```

---

## Done

All Medium articles now auto-appear in the portfolio blogs section on every page load. No manual updates required. Publishing on Medium → reload portfolio → new card appears.

import { PortableText, type PortableTextBlock } from "next-sanity";
import type { ContentBlock } from "@/sanity/lib/dal";
import { articleComponents } from "./article-components";
import { baseComponents } from "./base-components";

export type PortableTextVariant = "base" | "article";

interface PortableTextRendererProps {
	value: PortableTextBlock[] | ContentBlock[];
	variant?: PortableTextVariant;
}

/**
 * Typography shell for the `article` variant. We pin the font family
 * (Inter Tight via --font-sans), a modular type scale that gives each
 * heading clear separation from body and adjacent levels, and heading
 * margins. Weights and colors stay author-driven via PortableText
 * annotations — inline `style` beats class selectors so authors always
 * win. Line-heights inherit the plugin's em-based defaults.
 *
 * Scale uses ~1.2 ratio (minor third) on mobile and ~1.25 (major third)
 * on desktop. Body grows 16 → 17 → 18; H1 grows 30 → 36 → 44 so the
 * hierarchy body < h6 < h5 < h4 < h3 < h2 < h1 reads cleanly at every
 * breakpoint without the headings collapsing into the paragraph size.
 */
const ARTICLE_PROSE = [
	"prose prose-neutral max-w-none font-sans",

	// Responsive text sizes (arbitrary rem so only font-size is set; line-height
	// inherits the plugin's per-element default).
	"prose-p:text-base md:prose-p:text-[1.0625rem] lg:prose-p:text-[1.125rem]",
	"prose-blockquote:text-base md:prose-blockquote:text-[1.0625rem] lg:prose-blockquote:text-[1.125rem]",
	"prose-h1:text-[1.875rem] md:prose-h1:text-[2.25rem] lg:prose-h1:text-[2.75rem]",
	"prose-h2:text-[1.5rem] md:prose-h2:text-[1.75rem] lg:prose-h2:text-[2.125rem]",
	"prose-h3:text-[1.25rem] md:prose-h3:text-[1.5rem] lg:prose-h3:text-[1.625rem]",
	"prose-h4:text-[1.125rem] md:prose-h4:text-[1.25rem] lg:prose-h4:text-[1.375rem]",
	"prose-h5:text-[1.0625rem] md:prose-h5:text-[1.125rem] lg:prose-h5:text-[1.25rem]",
	"prose-h6:text-base md:prose-h6:text-[1.0625rem] lg:prose-h6:text-[1.125rem]",

	// Heading margins — larger headings get a bit more breathing room above.
	"prose-h1:mt-0 prose-h1:mb-8",
	"prose-h2:mt-12 prose-h2:mb-5",
	"prose-h3:mt-10 prose-h3:mb-4",
	"prose-h4:mt-8 prose-h4:mb-3",
	"prose-h5:mt-6 prose-h5:mb-2",
	"prose-h6:mt-6 prose-h6:mb-2",

	// Blockquote structure only — text styling is author-driven like everywhere else.
	"prose-blockquote:my-6 prose-blockquote:pl-3 prose-blockquote:not-italic",
	"prose-blockquote:border-l-2 prose-blockquote:border-[var(--brand-primary,var(--accent-coral))]",

	// Links — subtle underline, darkens on hover.
	"prose-a:underline prose-a:decoration-muted-foreground hover:prose-a:decoration-foreground",

	// HR
	"prose-hr:border-border",
].join(" ");

/**
 * Shared PortableText entry point. Pick `base` for lightweight surfaces (bio,
 * company description) and `article` for full case-study bodies with
 * headings, lists, links, and inline Cloudinary images.
 */
export function PortableTextRenderer({
	value,
	variant = "base",
}: PortableTextRendererProps) {
	if (variant === "article") {
		return (
			<div className={ARTICLE_PROSE}>
				<PortableText
					value={value as PortableTextBlock[]}
					components={articleComponents}
				/>
			</div>
		);
	}

	return (
		<PortableText
			value={value as PortableTextBlock[]}
			components={baseComponents}
		/>
	);
}

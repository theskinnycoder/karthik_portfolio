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
 * Typography shell for the `article` variant. We deliberately pin **only**
 * three things: the global font family (Inter Tight via --font-sans),
 * responsive sizes, and Figma-tuned heading margins.
 *
 * Weights and colors are author-driven via PortableText annotations
 * (`textColor`, `fontWeight`, `fontFamily`) — inline `style` beats these
 * class selectors so authors always win. Line-heights inherit the plugin's
 * defaults.
 *
 * Mobile sizes come from Figma (14px body, 17px H1, 16px H2, etc.). Desktop
 * steps extrapolate by roughly the Tailwind prose-sm → prose-base → prose-lg
 * progression. The hierarchy body ≤ h6 < h5 < h4 < h3 < h2 < h1 holds at
 * every breakpoint.
 */
const ARTICLE_PROSE = [
	"prose prose-neutral max-w-none font-sans",

	// Responsive text sizes (arbitrary rem so only font-size is set; line-height
	// inherits the plugin's per-element default).
	"prose-p:text-[0.875rem] md:prose-p:text-[0.9375rem] lg:prose-p:text-[1rem]",
	"prose-blockquote:text-[0.875rem] md:prose-blockquote:text-[0.9375rem] lg:prose-blockquote:text-[1rem]",
	"prose-h1:text-[1.0625rem] md:prose-h1:text-[1.25rem] lg:prose-h1:text-[1.5rem]",
	"prose-h2:text-[1rem] md:prose-h2:text-[1.125rem] lg:prose-h2:text-[1.25rem]",
	"prose-h3:text-[0.875rem] md:prose-h3:text-[1rem] lg:prose-h3:text-[1.125rem]",
	"prose-h4:text-[0.875rem] md:prose-h4:text-[0.9375rem] lg:prose-h4:text-[1rem]",
	"prose-h5:text-[0.8125rem] md:prose-h5:text-[0.875rem] lg:prose-h5:text-[0.9375rem]",
	"prose-h6:text-[0.75rem] md:prose-h6:text-[0.8125rem] lg:prose-h6:text-[0.875rem]",

	// Heading-specific margins (tuned from Figma frame gaps).
	"prose-h1:mt-0 prose-h1:mb-6",
	"prose-h2:mt-8 prose-h2:mb-4",
	"prose-h3:mt-6 prose-h3:mb-3",
	"prose-h4:mt-6 prose-h4:mb-2",
	"prose-h5:mt-4 prose-h5:mb-2",
	"prose-h6:mt-4 prose-h6:mb-2",

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

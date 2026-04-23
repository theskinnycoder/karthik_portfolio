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
 * Typography styles for the `article` variant. `prose` gives us headings,
 * lists, marks, and link defaults out of the box; the modifiers below remap
 * colors, spacing, and weights onto the data-theme="work-detail" tokens so
 * case studies match the Figma palette without per-element classes.
 */
const ARTICLE_PROSE = [
	"prose prose-neutral max-w-none",
	"prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight",
	"prose-p:font-light prose-p:text-muted-foreground prose-p:leading-relaxed",
	"prose-strong:font-medium prose-strong:text-foreground",
	"prose-a:text-foreground prose-a:font-normal prose-a:decoration-muted-foreground hover:prose-a:decoration-foreground",
	"prose-blockquote:border-l-2 prose-blockquote:border-[var(--brand-primary,var(--accent-coral))] prose-blockquote:text-muted-foreground prose-blockquote:font-light prose-blockquote:not-italic",
	"prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em] prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none",
	"prose-li:text-muted-foreground prose-li:font-light",
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

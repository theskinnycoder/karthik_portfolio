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
 * Shared PortableText entry point. Pick `base` for lightweight surfaces (bio,
 * company description) and `article` for full case-study bodies with
 * headings, lists, links, and inline Cloudinary images.
 */
export function PortableTextRenderer({
	value,
	variant = "base",
}: PortableTextRendererProps) {
	const components = variant === "article" ? articleComponents : baseComponents;
	return (
		<PortableText
			value={value as PortableTextBlock[]}
			components={components}
		/>
	);
}

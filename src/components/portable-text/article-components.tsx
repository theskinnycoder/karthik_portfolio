import type { PortableTextComponents } from "next-sanity";
import type { ContentImageDTO, ContentTestimonialDTO } from "@/sanity/lib/dal";
import { ContentImage, ContentTestimonial } from "./blocks";

/**
 * Component map for case-study articles. The wrapping container applies the
 * `prose` utility (see PortableTextRenderer), so native prose elements —
 * headings, paragraphs, lists, marks, links, inline code — inherit
 * typography-plugin styling automatically.
 *
 * We only override what prose can't express:
 * - `link` carries PortableText-specific href / openInNewTab data
 * - `types` wires custom contentImage / contentTestimonial blocks
 *
 * Block-level marks (strong, em, code) fall through to prose defaults, which
 * the data-theme="work-detail" tokens recolor to the Figma palette.
 */
export const articleComponents: PortableTextComponents = {
	marks: {
		link: ({ value, children }) => {
			const href = typeof value?.href === "string" ? value.href : "#";
			const openInNewTab = Boolean(value?.openInNewTab);
			return (
				<a
					href={href}
					target={openInNewTab ? "_blank" : undefined}
					rel={openInNewTab ? "noopener noreferrer" : undefined}
				>
					{children}
				</a>
			);
		},
	},
	types: {
		contentImage: ({ value }: { value: ContentImageDTO }) => (
			<ContentImage value={value} />
		),
		contentTestimonial: ({ value }: { value: ContentTestimonialDTO }) => (
			<ContentTestimonial value={value} />
		),
	},
};

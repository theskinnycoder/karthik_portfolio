import type { PortableTextComponents } from "next-sanity";
import type {
	ContentDividerDTO,
	ContentImageDTO,
	ContentMetaDTO,
	ContentTestimonialDTO,
	ContentVideoDTO,
} from "@/sanity/lib/dal";
import {
	ContentDivider,
	ContentImage,
	ContentMeta,
	ContentTestimonial,
	ContentVideo,
} from "./blocks";

/**
 * Component map for case-study articles. The wrapping container applies the
 * `prose` utility (see PortableTextRenderer) so headings, paragraphs, lists
 * and decorators (em / s / underline) pick up typography-plugin defaults.
 *
 * Custom mark annotations (textColor, fontWeight, fontFamily) paint inline
 * styles so an author can override the prose defaults per-span from Studio.
 * Inline style beats prose's class selectors — authors always win.
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
		textColor: ({ value, children }) => {
			const hex =
				typeof value?.value?.hex === "string" ? value.value.hex : undefined;
			return <span style={hex ? { color: hex } : undefined}>{children}</span>;
		},
		fontWeight: ({ value, children }) => {
			const weight = typeof value?.value === "string" ? value.value : undefined;
			return (
				<span style={weight ? { fontWeight: weight } : undefined}>
					{children}
				</span>
			);
		},
		fontFamily: ({ value, children }) => {
			const family =
				value?.value === "serif"
					? "var(--font-serif)"
					: value?.value === "sans"
						? "var(--font-sans)"
						: undefined;
			return (
				<span style={family ? { fontFamily: family } : undefined}>
					{children}
				</span>
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
		contentDivider: ({ value }: { value: ContentDividerDTO }) => (
			<ContentDivider value={value} />
		),
		contentVideo: ({ value }: { value: ContentVideoDTO }) => (
			<ContentVideo value={value} />
		),
		contentMeta: ({ value }: { value: ContentMetaDTO }) => (
			<ContentMeta value={value} />
		),
	},
};

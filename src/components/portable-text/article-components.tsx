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

const WEIGHT_DECORATOR_RENDERERS = {
	weight300: 300,
	weight400: 400,
	weight500: 500,
	weight600: 600,
	weight700: 700,
} as const;

function makeWeightMark(weight: number) {
	function WeightMark({ children }: { children?: React.ReactNode }) {
		return <span style={{ fontWeight: weight }}>{children}</span>;
	}
	WeightMark.displayName = `WeightMark(${weight})`;
	return WeightMark;
}

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
		fontScript: ({ children }) => (
			<span style={{ fontFamily: "var(--font-serif)" }}>{children}</span>
		),
		// Legacy annotation marks from the previous schema. New content uses the
		// fontScript decorator and weight300..700 decorators; these keep already-
		// authored content rendering until it's re-saved.
		fontFamily: ({ value, children }) => {
			const v = value as { value?: string } | undefined;
			const family =
				v?.value === "serif"
					? "var(--font-serif)"
					: v?.value === "sans"
						? "var(--font-sans)"
						: undefined;
			return (
				<span style={family ? { fontFamily: family } : undefined}>
					{children}
				</span>
			);
		},
		fontWeight: ({ value, children }) => {
			const v = value as { value?: string } | undefined;
			const weight = typeof v?.value === "string" ? v.value : undefined;
			return (
				<span style={weight ? { fontWeight: weight } : undefined}>
					{children}
				</span>
			);
		},
		weight300: makeWeightMark(WEIGHT_DECORATOR_RENDERERS.weight300),
		weight400: makeWeightMark(WEIGHT_DECORATOR_RENDERERS.weight400),
		weight500: makeWeightMark(WEIGHT_DECORATOR_RENDERERS.weight500),
		weight600: makeWeightMark(WEIGHT_DECORATOR_RENDERERS.weight600),
		weight700: makeWeightMark(WEIGHT_DECORATOR_RENDERERS.weight700),
	},
	list: {
		check: ({ children }) => (
			<ul className="my-2 list-none pl-0">{children}</ul>
		),
	},
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		// Continues numbering across callouts (the renderer pre-processor
		// stamps each top-level numbered block with `_seq`).
		number: ({ children, value }) => {
			const seq = (value as { _seq?: number } | undefined)?._seq;
			return seq != null ? (
				<li value={seq}>{children}</li>
			) : (
				<li>{children}</li>
			);
		},
		check: ({ children }) => (
			<li className="my-1 flex gap-2 leading-6 before:flex-none before:content-['✔']">
				<span>{children}</span>
			</li>
		),
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

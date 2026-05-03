import type { PortableTextComponents } from "next-sanity";

/**
 * Minimal component map shared by all PortableText surfaces (bio, company
 * description, and article body). Only the primitives that every renderer
 * uses live here — caller-specific typography stays on the wrapping element.
 */
export const baseComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => <p>{children}</p>,
	},
	marks: {
		strong: ({ children }) => (
			<span className="text-foreground">{children}</span>
		),
	},
};

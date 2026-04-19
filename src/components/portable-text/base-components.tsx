import type { PortableTextComponents } from "next-sanity";

/**
 * Minimal component map shared by all PortableText surfaces (bio, company
 * description, and article body). Only the primitives that every renderer
 * uses live here — caller-specific typography stays on the wrapping element.
 */
export const baseComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => <p className="font-normal">{children}</p>,
		h1: ({ children }) => <h1 className="font-normal">{children}</h1>,
		h2: ({ children }) => <h2 className="font-normal">{children}</h2>,
		h3: ({ children }) => <h3 className="font-normal">{children}</h3>,
		h4: ({ children }) => <h4 className="font-normal">{children}</h4>,
		h5: ({ children }) => <h5 className="font-normal">{children}</h5>,
		h6: ({ children }) => <h6 className="font-normal">{children}</h6>,
	},
	marks: {
		strong: ({ children }) => (
			<span className="font-medium text-foreground">{children}</span>
		),
		fontRegular: ({ children }) => (
			<span className="font-normal">{children}</span>
		),
		fontMedium: ({ children }) => (
			<span className="font-medium">{children}</span>
		),
		fontSemibold: ({ children }) => (
			<span className="font-semibold">{children}</span>
		),
		fontBold: ({ children }) => <span className="font-bold">{children}</span>,
	},
};

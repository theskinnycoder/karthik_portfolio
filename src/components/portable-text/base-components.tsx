import type { PortableTextComponents } from "next-sanity";
import { inlineMarks } from "./inline-marks";

/**
 * Minimal component map for short PortableText surfaces (bio, company
 * description, excerpts, quotes). Inline decorators (weight + color +
 * fontScript) come from the shared `inlineMarks`. Lists are wired up so the
 * occasional bullet/number list authored inside an inline block doesn't emit
 * "Unknown list item style" warnings.
 *
 * Default text color is set by the wrapping element on the consumer side
 * (e.g. `text-paragraph` on the company description container). Decorators
 * override per-span.
 */
export const baseComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => <p>{children}</p>,
	},
	marks: inlineMarks,
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		number: ({ children }) => <li>{children}</li>,
	},
};

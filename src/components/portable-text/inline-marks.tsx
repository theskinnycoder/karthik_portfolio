import type { PortableTextComponents } from "next-sanity";
import type { ReactNode } from "react";
import { COLOR_DECORATORS, COLOR_TOKENS } from "@/sanity/rich-text/constants";

const WEIGHTS = [300, 400, 500, 600, 700] as const;

function makeWeightMark(weight: number) {
	return function WeightMark({ children }: { children?: ReactNode }) {
		return <span style={{ fontWeight: weight }}>{children}</span>;
	};
}

function makeColorMark(cssVar: string) {
	return function ColorMark({ children }: { children?: ReactNode }) {
		return <span style={{ color: `var(${cssVar})` }}>{children}</span>;
	};
}

const weightMarks = Object.fromEntries(
	WEIGHTS.map((w) => [`weight${w}`, makeWeightMark(w)]),
);

const colorMarks = Object.fromEntries(
	COLOR_DECORATORS.map((c) => [c, makeColorMark(COLOR_TOKENS[c])]),
);

/**
 * Shared inline marks renderer. Used by both `baseComponents` (short
 * paragraphs) and `articleComponents` (case study body) so the same authoring
 * decorators render identically wherever rich text appears.
 */
export const inlineMarks: NonNullable<PortableTextComponents["marks"]> = {
	...weightMarks,
	...colorMarks,
	fontScript: ({ children }) => (
		<span style={{ fontFamily: "var(--font-serif)" }}>{children}</span>
	),
};

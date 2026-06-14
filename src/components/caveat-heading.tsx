"use client";

import SplitText from "@/components/SplitText";
import { cn } from "@/lib/utils";

/**
 * Left-aligned, Caveat (font-serif) section heading with the SplitText
 * char-reveal animation. Shared by the Work and Proud Moments sections.
 * `pr-6` gives the slanted Caveat flourishes room inside SplitText's
 * `overflow-hidden` wrapper so the trailing glyph isn't clipped.
 */
export function CaveatHeading({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<SplitText
			text={text}
			tag="h2"
			className={cn(
				"pr-6 text-left font-serif text-5xl font-semibold text-foreground",
				className,
			)}
			splitType="chars"
		/>
	);
}

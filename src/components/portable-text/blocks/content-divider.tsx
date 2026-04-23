import type { ContentDividerDTO } from "@/sanity/lib/dal";

interface ContentDividerProps {
	value: ContentDividerDTO;
}

/**
 * Section separator. `line` renders a thin rule; `space` renders invisible
 * vertical breathing room (useful between stacked images where a rule would
 * feel heavy). Both flavors are `not-prose` so prose's default `<hr>` spacing
 * doesn't double up.
 */
export function ContentDivider({ value }: ContentDividerProps) {
	if (value.style === "space") {
		return (
			<div
				aria-hidden
				className="not-prose my-10"
			/>
		);
	}
	return <hr className="not-prose my-10 border-t border-border" />;
}

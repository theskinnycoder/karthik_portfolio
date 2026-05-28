import type { ContentBadgesDTO } from "@/sanity/lib/dal";

interface ContentBadgesProps {
	value: ContentBadgesDTO;
}

/**
 * Renders a wrapping row of pill badges from the `contentBadges` block.
 * Badges use the same visual style as the work-item card tag chip.
 * Empty badge arrays render nothing.
 */
export function ContentBadges({ value }: ContentBadgesProps) {
	if (value.badges.length === 0) return null;

	return (
		<div className="not-prose my-6 flex flex-wrap gap-2">
			{value.badges.map((badge, i) => (
				<span
					key={`${badge}-${i}`}
					className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-light tracking-prose whitespace-nowrap text-foreground"
				>
					{badge}
				</span>
			))}
		</div>
	);
}

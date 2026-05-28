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
					className="rounded-full border-2 border-[#D4D4D4] px-5 py-1.5 text-[1.125rem] font-normal tracking-prose whitespace-nowrap text-foreground shadow-[0px_1px_3px_0px_#D4D4D4] md:text-[1.25rem] lg:text-[1.375rem]"
				>
					{badge}
				</span>
			))}
		</div>
	);
}

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
		<div className="not-prose -mx-6 my-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
			<div className="flex gap-2 px-6">
				{value.badges.map((badge, i) => (
					<span
						key={`${badge}-${i}`}
						className="shrink-0 rounded-full border-[1.5px] border-[#D4D4D4] px-5 py-1.5 text-[1.125rem] font-normal tracking-prose whitespace-nowrap text-paragraph md:text-[1.25rem]"
					>
						{badge}
					</span>
				))}
			</div>
		</div>
	);
}

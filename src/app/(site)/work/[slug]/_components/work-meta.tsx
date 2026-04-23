import type { ReactNode } from "react";
import type { WorkItemDetailDTO } from "@/sanity/lib/dal";

interface WorkMetaProps {
	work: WorkItemDetailDTO;
}

/**
 * Inline meta block. Mirrors Figma 538:235 "Final Container" — each section
 * is a label row (1.5×18 coral divider + uppercase title) stacked above a
 * value row. No surrounding card; the block reads as part of the article
 * flow rather than a boxed panel.
 */
export function WorkMeta({ work }: WorkMetaProps) {
	const timeline = work.duration
		? `${work.year} · ${work.duration}`
		: work.year;

	return (
		<div className="not-prose flex flex-col gap-6">
			<MetaSection label="My Work">{work.role}</MetaSection>

			{work.team.length > 0 && (
				<MetaSection label="Team">
					<ul className="flex flex-col gap-1.5">
						{work.team.map((member) => (
							<li
								key={member.name}
								className="flex flex-wrap items-baseline gap-x-2"
							>
								<span className="font-medium text-foreground">
									{member.name}
								</span>
								<span className="text-muted-foreground">· {member.role}</span>
							</li>
						))}
					</ul>
				</MetaSection>
			)}

			<MetaSection label="Timeline">{timeline}</MetaSection>

			{work.stack && work.stack.length > 0 && (
				<MetaSection label="Tools">{work.stack.join(", ")}</MetaSection>
			)}
		</div>
	);
}

interface MetaSectionProps {
	label: string;
	children: ReactNode;
}

function MetaSection({ label, children }: MetaSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2.5">
				<span
					aria-hidden
					className="block h-[18px] w-[1.5px] rounded-sm bg-[var(--accent-coral)]"
				/>
				<span className="text-xs font-light tracking-wide text-foreground uppercase">
					{label}
				</span>
			</div>
			<div className="pl-[11px] text-sm text-foreground">{children}</div>
		</div>
	);
}

import type { ReactNode } from "react";
import { MediaImage } from "@/components/media";
import type { ContentMetaDTO, TeamMemberDTO } from "@/sanity/lib/dal";

interface ContentMetaProps {
	value: ContentMetaDTO;
}

/**
 * Inline meta panel. Mirrors Figma's "My Work / Team / Time Line / Tools"
 * sections — each section has a 1.5×18 coral tick + uppercase label above a
 * value row. Sections with no content are skipped, so authors can pick
 * whatever subset applies to a given case study.
 *
 * Not a fixed panel: rendered wherever the author drops the block inside the
 * article body (replaces the old top-level WorkMeta component).
 */
export function ContentMeta({ value }: ContentMetaProps) {
	const hasTeam = value.team.length > 0;
	const hasTools = value.tools.length > 0;

	return (
		<div className="not-prose my-8 flex flex-col gap-6">
			{value.role && <MetaSection label="My Work">{value.role}</MetaSection>}

			{hasTeam && (
				<MetaSection label="Team">
					<TeamRoster members={value.team} />
				</MetaSection>
			)}

			{value.timeline && (
				<MetaSection label="Time Line">{value.timeline}</MetaSection>
			)}

			{hasTools && (
				<MetaSection label="Tools">{value.tools.join(", ")}</MetaSection>
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

function TeamRoster({ members }: { members: TeamMemberDTO[] }) {
	const withAvatars = members.filter(
		(m): m is TeamMemberDTO & { avatar: string } => Boolean(m.avatar),
	);

	return (
		<div className="flex flex-col gap-4">
			{withAvatars.length > 0 && (
				<div className="inline-flex w-fit overflow-hidden rounded-xl border border-border bg-background p-1 shadow-sm">
					<div className="flex gap-0.5">
						{withAvatars.map((m) => (
							<MediaImage
								key={m.name}
								src={m.avatar}
								alt={m.name}
								width={48}
								height={48}
								className="size-12 rounded-md object-cover"
							/>
						))}
					</div>
				</div>
			)}
			<ul className="flex flex-col gap-1.5">
				{members.map((m) => (
					<li
						key={m.name}
						className="text-foreground"
					>
						<span className="font-medium">{m.name}</span>
						{", "}
						<span className="font-light">{m.role}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

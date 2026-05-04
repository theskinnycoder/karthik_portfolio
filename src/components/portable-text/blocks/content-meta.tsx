import type { ReactNode } from "react";
import { MediaImage } from "@/components/media";
import type { ContentMetaDTO, TeamMemberDTO } from "@/sanity/lib/dal";

interface ContentMetaProps {
	value: ContentMetaDTO;
}

export function ContentMeta({ value }: ContentMetaProps) {
	const hasTeam = value.team.length > 0;
	const hasTools = value.tools.length > 0;

	return (
		<div className="not-prose my-8 flex flex-col gap-5">
			{value.role && (
				<MetaSection
					label="My Work"
					bodyPad="pl-[10px]"
				>
					{value.role}
				</MetaSection>
			)}

			{hasTeam && (
				<MetaSection
					label="Team"
					gap="gap-[18px]"
					bodyPad="pl-3"
				>
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
	gap?: string;
	bodyPad?: string;
}

function MetaSection({
	label,
	children,
	gap = "gap-1.5",
	bodyPad = "pl-3",
}: MetaSectionProps) {
	return (
		<div className={`flex flex-col ${gap}`}>
			<div className="flex items-center gap-2">
				<span
					aria-hidden
					className="block h-[18px] w-[1.5px] rounded-tr-[9px] rounded-br-[12px] bg-[var(--accent-coral)]"
				/>
				<span className="text-[0.875rem] font-semibold text-foreground md:text-[0.9375rem] lg:text-[1rem]">
					{label}
				</span>
			</div>
			<div
				className={`${bodyPad} text-[0.875rem] font-normal text-muted-foreground md:text-[0.9375rem] lg:text-[1rem]`}
			>
				{children}
			</div>
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
				<div className="flex -space-x-6">
					{withAvatars.map((m) => (
						<MediaImage
							key={m.name}
							src={m.avatar}
							alt={m.name}
							width={48}
							height={48}
							className="size-12"
						/>
					))}
				</div>
			)}
			<ul className="flex flex-col gap-1.5">
				{members.map((m) => (
					<li
						key={m.name}
						className="text-[0.875rem] font-normal text-muted-foreground md:text-[0.9375rem] lg:text-[1rem]"
					>
						{m.name}, {m.role}
					</li>
				))}
			</ul>
		</div>
	);
}

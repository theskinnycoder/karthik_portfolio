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
				<span className="text-[1.125rem] font-semibold text-foreground md:text-[1.25rem] lg:text-[1.375rem]">
					{label}
				</span>
			</div>
			<div
				className={`${bodyPad} text-[1.125rem] font-normal text-muted-foreground md:text-[1.25rem] lg:text-[1.375rem]`}
			>
				{children}
			</div>
		</div>
	);
}

const AVATAR_ROTATIONS = [-4, 3, -3, 4, -2, 3];

function TeamRoster({ members }: { members: TeamMemberDTO[] }) {
	const withAvatars = members.filter(
		(m): m is TeamMemberDTO & { avatar: string } => Boolean(m.avatar),
	);

	return (
		<div className="flex flex-col gap-4">
			{withAvatars.length > 0 && (
				<div className="flex -space-x-8">
					{withAvatars.map((m, i) => (
						<div
							key={m.name}
							className="relative size-22 shrink-0 overflow-hidden rounded-2xl"
							style={{
								transform: `rotate(${AVATAR_ROTATIONS[i % AVATAR_ROTATIONS.length]}deg)`,
							}}
						>
							<MediaImage
								src={m.avatar}
								alt={m.name}
								fill
								className="object-cover object-top"
							/>
						</div>
					))}
				</div>
			)}
			<ul className="flex flex-col gap-1.5">
				{members.map((m) => (
					<li
						key={m.name}
						className="text-[1.125rem] font-normal text-muted-foreground md:text-[1.25rem] lg:text-[1.375rem]"
					>
						{m.name}, {m.role}
					</li>
				))}
			</ul>
		</div>
	);
}

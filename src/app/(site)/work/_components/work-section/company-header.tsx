import type { PortableTextBlock } from "next-sanity";
import { MediaImage } from "@/components/media";
import { PortableTextRenderer } from "@/components/portable-text";
import { CompanyBadge } from "./company-badge";

interface CompanyHeaderProps {
	logo: string;
	name: string;
	isCurrent: boolean;
	badge?: string;
	workTagline?: string;
	workDescription?: PortableTextBlock[];
}

export function CompanyHeader({
	logo,
	name,
	isCurrent,
	badge,
	workTagline,
	workDescription,
}: CompanyHeaderProps) {
	return (
		<>
			<div className="sticky top-0 z-10 -mx-6 flex items-center gap-3 bg-background/95 px-6 py-3 backdrop-blur-sm">
				<MediaImage
					src={logo}
					alt={`${name} logo`}
					width={0}
					height={0}
					sizes="120px"
					className="h-8 w-auto object-contain"
				/>
				{badge && (
					<CompanyBadge tone={isCurrent ? "current" : "past"}>
						{badge}
					</CompanyBadge>
				)}
			</div>
			{(workTagline || workDescription) && (
				<div className="flex flex-col gap-3">
					{workTagline && (
						<p className="text-[1.125rem] font-semibold text-foreground md:text-[1.25rem] lg:text-[1.375rem]">
							{workTagline}
						</p>
					)}
					{workDescription && (
						<PortableTextRenderer
							value={workDescription}
							variant="article"
						/>
					)}
				</div>
			)}
		</>
	);
}

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
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-3">
				<MediaImage
					src={logo}
					alt={`${name} logo`}
					width={94}
					height={32}
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
						<p className="text-lg font-semibold text-foreground">
							{workTagline}
						</p>
					)}
					{workDescription && (
						<div className="text-base leading-prose font-light tracking-prose text-paragraph">
							<PortableTextRenderer
								value={workDescription}
								variant="base"
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

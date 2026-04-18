import type { PortableTextBlock } from "next-sanity";
import { MediaImage } from "@/components/media";
import { PortableTextRenderer } from "@/components/portable-text";

interface CompanyHeaderProps {
	logo: string;
	name: string;
	isCurrent: boolean;
	workTagline?: string;
	workDescription?: PortableTextBlock[];
}

export function CompanyHeader({
	logo,
	name,
	isCurrent,
	workTagline,
	workDescription,
}: CompanyHeaderProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<MediaImage
					src={logo}
					alt={`${name} logo`}
					width={94}
					height={32}
					className="h-8 w-auto object-contain"
				/>
				{isCurrent && (
					<span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
						<span className="bg-gradient-to-r from-[#c8ed97] to-[#47d9b8] bg-clip-text text-transparent">
							Current
						</span>
					</span>
				)}
			</div>
			{workTagline && (
				<p className="text-lg font-semibold text-foreground">{workTagline}</p>
			)}
			{workDescription && (
				<div className="text-sm font-light text-muted-foreground">
					<PortableTextRenderer
						value={workDescription}
						variant="base"
					/>
				</div>
			)}
		</div>
	);
}

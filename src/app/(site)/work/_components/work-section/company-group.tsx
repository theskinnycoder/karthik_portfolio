import type { WorkPageCompanyDTO } from "@/sanity/lib/dal";
import Image from "next/image";
import { CompanyHeader } from "./company-header";
import { WorkItemCard } from "./work-item-card";

interface CompanyGroupProps {
	company: WorkPageCompanyDTO;
	/** Prioritize-load this group's first card image (set on the first group for LCP). */
	priorityFirstItem?: boolean;
}

export function CompanyGroup({
	company,
	priorityFirstItem = false,
}: CompanyGroupProps) {
	return (
		<div className="flex flex-col gap-5">
			<CompanyHeader
				logo={company.logo}
				name={company.name}
				isCurrent={company.isCurrent}
				badge={company.badge}
				workTagline={company.workTagline}
				workDescription={company.workDescription}
			/>
			<div className="relative flex flex-col gap-6">
				<p className="text-base leading-5 font-semibold text-muted-foreground">
					My key recipe's at <span className="capitalize">{company.name}</span>
				</p>
				<Image
					src="/arrow.gif"
					alt=""
					width={80}
					height={80}
					aria-hidden="true"
					className="pointer-events-none absolute top-0 left-36 z-10 w-20"
					unoptimized
				/>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{company.workItems.map((item, idx) => (
						<div
							key={item.slug}
							className="h-full w-full md:[&:last-child:nth-child(odd)]:col-span-full md:[&:last-child:nth-child(odd)]:[--card-image-ratio:2.2]"
						>
							<WorkItemCard
								item={item}
								priority={priorityFirstItem && idx === 0}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

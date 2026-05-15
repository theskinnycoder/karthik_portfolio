import type { WorkPageCompanyDTO } from "@/sanity/lib/dal";
import { CompanyHeader } from "./company-header";
import { WorkItemCard } from "./work-item-card";

interface CompanyGroupProps {
	company: WorkPageCompanyDTO;
}

export function CompanyGroup({ company }: CompanyGroupProps) {
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
					My key recipe at <span className="lowercase">{company.name}</span>
				</p>
				<img
					src="/arrow.gif"
					alt=""
					aria-hidden="true"
					className="pointer-events-none absolute top-0 left-36 w-20"
				/>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{company.workItems.map((item) => (
						<WorkItemCard
							key={item.slug}
							item={item}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

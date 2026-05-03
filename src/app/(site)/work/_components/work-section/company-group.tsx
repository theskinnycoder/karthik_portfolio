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
			<div className="flex flex-col gap-2">
				<p className="text-base leading-5 font-semibold text-muted-foreground">
					My key recipe at <span className="lowercase">{company.name}</span>
				</p>
				<div className="flex flex-col gap-4">
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

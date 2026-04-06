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
				workTagline={company.workTagline}
				workDescription={company.workDescription}
			/>
			<div className="flex flex-col gap-2">
				<p className="text-xs font-medium tracking-wide text-muted-foreground">
					My key recipe at {company.name}
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

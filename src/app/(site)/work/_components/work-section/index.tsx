import { getWorkPageCompanies } from "@/sanity/lib/dal";
import { CompanyGroup } from "./company-group";
import { FadeInSection } from "./fade-in-section";

export async function WorkSection() {
	const companies = await getWorkPageCompanies();

	if (companies.length === 0) {
		return (
			<p className="text-center text-muted-foreground">No work items yet.</p>
		);
	}

	return (
		<div className="flex flex-col gap-11">
			{companies.map((company, idx) => (
				<FadeInSection key={company.name}>
					<CompanyGroup
						company={company}
						priorityFirstItem={idx === 0}
					/>
				</FadeInSection>
			))}
		</div>
	);
}

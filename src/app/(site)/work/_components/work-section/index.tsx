import { getWorkPageCompanies } from "@/sanity/lib/dal";
import { CompanyGroup } from "./company-group";

export async function WorkSection() {
	const companies = await getWorkPageCompanies();

	if (companies.length === 0) {
		return (
			<p className="text-center text-muted-foreground">No work items yet.</p>
		);
	}

	return (
		<div className="flex flex-col gap-11">
			{companies.map((company) => (
				<CompanyGroup
					key={company.name}
					company={company}
				/>
			))}
		</div>
	);
}

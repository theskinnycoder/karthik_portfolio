import { CaveatHeading } from "@/components/caveat-heading";
import { getSectionHeader, getWorkPageCompanies } from "@/sanity/lib/dal";
import { CompanyGroup } from "./company-group";
import { FadeInSection } from "./fade-in-section";

export async function WorkSection() {
	const [companies, header] = await Promise.all([
		getWorkPageCompanies(),
		getSectionHeader("work"),
	]);

	if (companies.length === 0) {
		return (
			<p className="text-center text-muted-foreground">No work items yet.</p>
		);
	}

	const headingText = header?.headingHighlight ?? "Selected Work";

	return (
		<div className="flex flex-col gap-10">
			<div className="relative w-fit">
				<CaveatHeading text={headingText} />
			</div>

			<div className="flex flex-col gap-24">
				{companies.map((company, idx) => (
					<FadeInSection key={company.name}>
						<CompanyGroup
							company={company}
							priorityFirstItem={idx === 0}
						/>
					</FadeInSection>
				))}
			</div>
		</div>
	);
}

import { ItemGroup, ItemSeparator } from "@/components/ui/item";
import { getExperiences, getSectionHeader } from "@/sanity/lib/dal";
import { ExperienceItem } from "./experience-item";

export async function ExperienceSection() {
	const [experiences, header] = await Promise.all([
		getExperiences(),
		getSectionHeader("experience"),
	]);

	const headingHighlight = header?.headingHighlight ?? "Hands-on Experience";

	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-center text-3xl font-semibold text-foreground">
				{headingHighlight}
			</h2>

			<ItemGroup>
				{experiences.map((exp, i) => (
					<div key={exp.company}>
						<ExperienceItem {...exp} />
						{i < experiences.length - 1 && <ItemSeparator />}
					</div>
				))}
			</ItemGroup>
		</section>
	);
}

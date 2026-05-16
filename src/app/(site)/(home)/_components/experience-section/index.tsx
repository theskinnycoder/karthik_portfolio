import { MenuListItem } from "@/components/MenuList";
import { ExperienceHeading } from "./experience-heading";
import { ItemGroup } from "@/components/ui/item";
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
			<div className="relative mx-auto w-fit">
				<ExperienceHeading text={headingHighlight} />
			</div>
			<ItemGroup>
				{experiences.map((exp) => (
					<div key={exp.url}>
						<MenuListItem>
							<ExperienceItem {...exp} />
						</MenuListItem>
					</div>
				))}
			</ItemGroup>
		</section>
	);
}

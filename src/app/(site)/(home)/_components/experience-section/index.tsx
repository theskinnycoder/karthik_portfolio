import { MenuListItem } from "@/components/MenuList";
import SplitText from "@/components/SplitText";
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
			<SplitText
				text={headingHighlight}
				tag="h2"
				className="text-center text-3xl font-semibold text-foreground"
				splitType="chars"
			/>

			<ItemGroup>
				{experiences.map((exp) => (
					<div key={exp.company}>
						<MenuListItem>
							<ExperienceItem {...exp} />
						</MenuListItem>
					</div>
				))}
			</ItemGroup>
		</section>
	);
}

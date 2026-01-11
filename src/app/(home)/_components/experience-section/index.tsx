import { ItemGroup, ItemSeparator } from "@/components/ui/item";
import { ExperienceItem, type ExperienceItemProps } from "./experience-item";

const experiences = [
	{
		company: "Hearzap",
		url: "https://hearzap.com",
		description: "Apxor Consultant work",
		role: "Product Designer",
	},
	{
		company: "Eclaire",
		url: "https://eclaire.ai",
		description: "Apxor Consultant work",
		role: "Product Designer",
	},
	{
		company: "Apxor",
		url: "https://apxor.com",
		description: "March 2023 - Current",
		role: "Product Designer",
	},
	{
		company: "e-Yantra",
		url: "https://e-yantra.org",
		description: "Jan 2022 - Feb 2022",
		role: "3d Modeling Design",
	},
] satisfies ExperienceItemProps[];

export function ExperienceSection() {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-center text-3xl font-semibold text-foreground">
				Hands-on Experience
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

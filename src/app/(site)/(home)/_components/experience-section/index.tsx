import { MenuListItem } from "@/components/MenuList";
import { ExperienceHeading } from "./experience-heading";
import { ItemGroup } from "@/components/ui/item";
import { getExperiences, getSectionHeader } from "@/sanity/lib/dal";
import Image from "next/image";
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

				<Image
					src="/Blink.gif"
					alt=""
					width={60}
					height={60}
					unoptimized
					className="pointer-events-none absolute top-[-22px] right-[-35px] z-10 rotate-[-35deg]"
				/>
			</div>
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

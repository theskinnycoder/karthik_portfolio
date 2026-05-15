import { MenuListItem } from "@/components/MenuList";
import SplitText from "@/components/SplitText";
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
			<div className="relative w-fit mx-auto">
				<SplitText
					text={headingHighlight}
					tag="h2"
					className="text-center text-3xl font-semibold text-foreground"
					splitType="chars"
				/>

				<Image
					src="/Blink.gif"
					alt=""
					width={60}
					height={60}
					unoptimized
					className="pointer-events-none absolute top-[-22px] right-[-35px] z-10 rotate-[-35deg] "
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

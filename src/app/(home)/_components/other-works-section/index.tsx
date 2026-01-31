import { getProjects, getSectionHeader } from "@/sanity/lib/dal";
import { HeroHeader } from "./hero-header";
import { OtherWorksCarousel } from "./other-works-carousel";

export async function OtherWorksSection() {
	const [projects, header] = await Promise.all([
		getProjects(),
		getSectionHeader("other-works"),
	]);

	return (
		<section className="flex flex-col items-center gap-9">
			<HeroHeader
				headingPrefix={header?.headingPrefix}
				headingHighlight={header?.headingHighlight}
				headingEmoji={header?.headingEmoji}
				icon={header?.icon}
				iconPublicId={header?.iconPublicId}
				videoUrl={header?.videoUrl}
				videoPublicId={header?.videoPublicId}
				subheading={header?.subheading}
				gradientFrom={header?.gradientFrom}
				gradientTo={header?.gradientTo}
			/>
			<OtherWorksCarousel projects={projects} />
		</section>
	);
}

"use cache";

import { cachePageLife } from "@/lib/caching";
import { getHomePageSections } from "@/sanity/lib/dal";
import type { HomeSectionKey } from "@/sanity/schemaTypes/homePage";
import { ExperienceSection } from "./_components/experience-section";
import { IntroSection } from "./_components/intro-section";
import { OtherWorksSection } from "./_components/other-works-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { VideoHeroSection } from "./_components/video-hero-section";

const SECTION_REGISTRY: Record<HomeSectionKey, () => React.ReactNode> = {
	intro: IntroSection,
	experience: ExperienceSection,
	otherWorks: OtherWorksSection,
	testimonials: TestimonialsSection,
};

export default async function Page() {
	cachePageLife();
	const sections = await getHomePageSections();

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 pt-16 pb-24">
			<VideoHeroSection />
			<div className="flex w-full flex-col gap-32 md:gap-40">
				{sections.map((key) => {
					const Section = SECTION_REGISTRY[key];
					return <Section key={key} />;
				})}
			</div>
		</main>
	);
}

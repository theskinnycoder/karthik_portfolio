"use cache";

import { cachePageLife } from "@/lib/caching";
import { ExperienceSection } from "./_components/experience-section";
import { IntroSection } from "./_components/intro-section";
import { OtherWorksSection } from "./_components/other-works-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { VideoHeroSection } from "./_components/video-hero-section";

export default async function Page() {
	cachePageLife();

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 pt-16 pb-24">
			<VideoHeroSection />
			<div className="flex w-full flex-col gap-32 md:gap-40">
				<IntroSection />
				<ExperienceSection />
				<OtherWorksSection />
				<TestimonialsSection />
			</div>
		</main>
	);
}

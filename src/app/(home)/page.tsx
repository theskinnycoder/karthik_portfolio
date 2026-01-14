"use cache";

import { cachePageLife } from "@/lib/caching";
import { ExperienceSection } from "./_components/experience-section";
import { IntroSection } from "./_components/intro-section";
import { OtherWorksSection } from "./_components/other-works-section";
import { TestimonialsSection } from "./_components/testimonials-section";

export default async function Page() {
	cachePageLife();

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 py-16">
			<IntroSection />
			<ExperienceSection />
			<OtherWorksSection />
			<TestimonialsSection />
		</main>
	);
}

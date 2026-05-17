import { ScrollSpy } from "@/components/scroll-spy";
import { getHomePageSections } from "@/sanity/lib/dal";
import type { HomeSectionKey } from "@/sanity/schemaTypes/homePage";
import { ExperienceSection } from "../(home)/_components/experience-section";
import { IntroSection } from "../(home)/_components/intro-section";
import { OtherWorksSection } from "../(home)/_components/other-works-section";
import { TestimonialsSection } from "../(home)/_components/testimonials-section";
import { VideoHeroSection } from "../(home)/_components/video-hero-section";
import { WorkSection } from "../work/_components/work-section";

function BlogsSection() {
	return (
		<>
			<h1 className="font-serif text-4xl">Blogs</h1>
			<p className="text-xl text-muted-foreground">Work in progress!</p>
		</>
	);
}

const SECTION_REGISTRY: Partial<Record<HomeSectionKey, () => React.ReactNode>> = {
	experience: ExperienceSection,
	otherWorks: OtherWorksSection,
	testimonials: TestimonialsSection,
};

export async function SitePage({
	initialSection = "about",
}: {
	initialSection?: "about" | "work" | "blogs";
}) {
	const sections = await getHomePageSections();

	return (
		<main className="flex flex-col">
			<section
				id="about"
				className="mx-auto flex w-full max-w-5xl flex-col gap-16 pt-10 md:pt-20 xl:pt-[7.5rem] pb-20"
			>
				<div className="flex flex-col-reverse gap-16 px-6 md:px-[1.125rem] xl:grid xl:grid-cols-2 xl:items-start xl:gap-16">
					<IntroSection />
					<VideoHeroSection />
				</div>
				<div className="flex w-full flex-col gap-32 px-6 md:gap-40 md:px-[1.125rem]">
					{sections
						.filter((key) => key !== "intro")
						.map((key) => {
							const Section = SECTION_REGISTRY[key];
							if (!Section) return null;
							return <Section key={key} />;
						})}
				</div>
			</section>

			<section
				id="work"
				className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-8 pb-24 md:px-11"
			>
				<WorkSection />
			</section>

			<section
				id="blogs"
				className="mx-auto flex h-dvh w-full max-w-5xl flex-col items-center justify-center gap-2 px-6 md:px-11"
			>
				<BlogsSection />
			</section>

			<ScrollSpy initialSection={initialSection} />
		</main>
	);
}

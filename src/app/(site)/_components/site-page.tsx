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

const SECTION_REGISTRY: Record<HomeSectionKey, () => React.ReactNode> = {
	intro: IntroSection,
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
				className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-16 pb-16 md:border-x md:border-zinc-800 md:px-11"
			>
				<VideoHeroSection />
				<div className="flex w-full flex-col gap-32 md:gap-40">
					{sections.map((key) => {
						const Section = SECTION_REGISTRY[key];
						return <Section key={key} />;
					})}
				</div>
			</section>

			<section
				id="work"
				className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-8 pb-24 md:border-x md:border-zinc-800 md:px-11"
			>
				<WorkSection />
			</section>

			<section
				id="blogs"
				className="mx-auto flex h-dvh w-full max-w-5xl flex-col items-center justify-center gap-2 px-6 md:border-x md:border-zinc-800 md:px-11"
			>
				<BlogsSection />
			</section>

			<ScrollSpy initialSection={initialSection} />
		</main>
	);
}

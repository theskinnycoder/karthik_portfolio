import { ScrollSpy } from "@/components/scroll-spy";
import { getHomePageSections } from "@/sanity/lib/dal";
import type { HomeSectionKey } from "@/sanity/lib/home-sections";
import { ExperienceSection } from "../(home)/_components/experience-section";
import { FooterSection } from "../(home)/_components/footer-section";
import { IntroSection } from "../(home)/_components/intro-section";
import { OtherWorksSection } from "../(home)/_components/other-works-section";
import { TestimonialsSection } from "../(home)/_components/testimonials-section";
import { VideoHeroSection } from "../(home)/_components/video-hero-section";
import { BlogsSection } from "../(home)/_components/blogs-section";
import { WorkSection } from "../work/_components/work-section";

type SectionConfig = {
	id?: string;
	className: string;
	Component: () => React.ReactNode;
};

const SECTION_CONFIGS: Partial<Record<HomeSectionKey, SectionConfig>> = {
	experience: {
		className: "mx-auto w-full max-w-5xl px-6 md:px-[1.125rem]",
		Component: ExperienceSection,
	},
	otherWorks: {
		className: "mx-auto w-full max-w-5xl px-6 md:px-[1.125rem]",
		Component: OtherWorksSection,
	},
	testimonials: {
		className: "mx-auto w-full max-w-5xl px-6 md:px-[1.125rem]",
		Component: TestimonialsSection,
	},
	work: {
		id: "work",
		className:
			"mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 pt-8 md:px-11",
		Component: WorkSection,
	},
	blogs: {
		id: "blogs",
		className: "mx-auto w-full max-w-5xl px-6 md:px-[1.125rem]",
		Component: BlogsSection,
	},
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
				className="mx-auto flex w-full max-w-5xl flex-col pt-10 md:pt-20 xl:pt-[7.5rem]"
			>
				<div className="flex flex-col-reverse gap-16 px-6 md:px-[1.125rem] xl:grid xl:grid-cols-2 xl:items-start xl:gap-16">
					<IntroSection />
					<VideoHeroSection />
				</div>
			</section>

			<div className="mt-22 flex flex-col gap-22 pb-6">
				{sections
					.filter((key) => key !== "intro")
					.map((key) => {
						const config = SECTION_CONFIGS[key];
						if (!config) return null;
						const { id, className, Component } = config;
						return (
							<section
								key={key}
								id={id}
								className={className}
							>
								<Component />
							</section>
						);
					})}
			</div>

			{/* Always-visible footer — intentionally outside the sections container */}
			<FooterSection />

			<ScrollSpy initialSection={initialSection} />
		</main>
	);
}

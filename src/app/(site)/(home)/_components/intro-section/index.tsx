import { getSiteProfile } from "@/sanity/lib/dal";
import { AboutSection } from "./about-section";
import { CompanyLogos } from "./company-logos-section";
import { HeroSection } from "./hero-section";
import { SocialLinks } from "./social-links-section";

export async function IntroSection() {
	const profile = await getSiteProfile();

	return (
		<section className="flex flex-col gap-8">
			<HeroSection
				name={profile?.name ?? []}
				title={profile?.title ?? []}
			/>
			<CompanyLogos />
			<AboutSection bio={profile?.bio} />
			<SocialLinks />
		</section>
	);
}

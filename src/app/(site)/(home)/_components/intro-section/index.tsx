import { getSiteProfile } from "@/sanity/lib/dal";
import { toPlainText } from "next-sanity";
import { AboutSection } from "./about-section";
import { CompanyLogos } from "./company-logos-section";
import { HeroSection } from "./hero-section";
import { SocialLinks } from "./social-links-section";

export async function IntroSection() {
	const profile = await getSiteProfile();

	return (
		<section className="flex flex-col gap-8">
			<HeroSection
				name={profile?.name ? toPlainText(profile.name) : "Karthik Panchala"}
				title={profile?.title ? toPlainText(profile.title) : "Product Designer"}
			/>
			<CompanyLogos />
			<AboutSection bio={profile?.bio} />
			<SocialLinks />
		</section>
	);
}

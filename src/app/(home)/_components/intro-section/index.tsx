import { getSiteProfile } from "@/sanity/lib/dal";
import { AboutSection } from "./about-section";
import { CompanyLogos } from "./company-logos-section";
import { HeroSection } from "./hero-section";
import { SocialLinks } from "./social-links-section";

export async function IntroSection() {
	const profile = await getSiteProfile();

	return (
		<section className="flex flex-col gap-7">
			<HeroSection
				name={profile?.name ?? "Karthik Panchala"}
				title={profile?.title ?? "Product Designer"}
			/>
			<div className="flex flex-col gap-6">
				<CompanyLogos />
				<div className="flex flex-col gap-6">
					<AboutSection bio={profile?.bio} />
					<SocialLinks />
				</div>
			</div>
		</section>
	);
}

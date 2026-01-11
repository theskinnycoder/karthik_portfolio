import { AboutSection } from "./about-section";
import { CompanyLogos } from "./company-logos-section";
import { HeroSection } from "./hero-section";
import { SocialLinks } from "./social-links-section";

export function IntroSection() {
	return (
		<section className="flex flex-col gap-7">
			<HeroSection
				name="Karthik Panchala"
				title="Product Designer"
			/>
			<div className="flex flex-col gap-6">
				<CompanyLogos />
				<div className="flex flex-col gap-6">
					<AboutSection />
					<SocialLinks />
				</div>
			</div>
		</section>
	);
}

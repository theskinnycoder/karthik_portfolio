import { getSiteProfile } from "@/sanity/lib/dal";
import { VideoHeroSectionClient } from "./video-hero-section-client";

export async function VideoHeroSection() {
	const profile = await getSiteProfile();
	return <VideoHeroSectionClient availability={profile?.availability as boolean} />;
}
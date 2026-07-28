import type { MetadataRoute } from "next";
import { getAllHighlightSlugs, getAllWorkItemSlugs } from "@/sanity/lib/dal";

const siteUrl = "https://imkarthik.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [workSlugs, highlightSlugs] = await Promise.all([
		getAllWorkItemSlugs(),
		getAllHighlightSlugs(),
	]);

	const workEntries: MetadataRoute.Sitemap = workSlugs.map((slug) => ({
		url: `${siteUrl}/work/${slug}`,
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	const highlightEntries: MetadataRoute.Sitemap = highlightSlugs.map(
		(slug) => ({
			url: `${siteUrl}/proud-moments/${slug}`,
			changeFrequency: "monthly",
			priority: 0.6,
		}),
	);

	// `/work`, `/blogs`, `/proud-moments` render the same single-page document as
	// `/` (only the initial scroll target differs) and canonicalize back to it —
	// they're intentionally excluded here to avoid duplicate-content entries.
	return [
		{
			url: siteUrl,
			changeFrequency: "weekly",
			priority: 1,
		},
		...workEntries,
		...highlightEntries,
	];
}

import type { MetadataRoute } from "next";

const siteUrl = "https://imkarthik.in";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/studio", "/api"],
		},
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}

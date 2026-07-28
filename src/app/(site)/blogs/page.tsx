"use cache";

import type { Metadata } from "next";
import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export async function generateMetadata(): Promise<Metadata> {
	cachePageLife();
	return {
		title: "Blog",
		description:
			"Writing on product design, strategy, and craft by Karthik Panchala.",
		// This route renders the same single-page document as `/`, scrolled to
		// the blogs section — canonicalize to avoid duplicate-content indexing.
		alternates: { canonical: "/" },
	};
}

export default async function BlogsPage() {
	cachePageLife();
	return <SitePage initialSection="blogs" />;
}

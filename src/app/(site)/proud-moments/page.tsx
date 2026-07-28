"use cache";

import type { Metadata } from "next";
import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export async function generateMetadata(): Promise<Metadata> {
	cachePageLife();
	return {
		title: "Proud Moments",
		description:
			"Career highlights and milestones from Karthik Panchala's work as a product designer.",
		// This route renders the same single-page document as `/`, scrolled to
		// the proud-moments section — canonicalize to avoid duplicate-content
		// indexing.
		alternates: { canonical: "/" },
	};
}

export default async function ProudMomentsPage() {
	cachePageLife();
	return <SitePage initialSection="proud-moments" />;
}

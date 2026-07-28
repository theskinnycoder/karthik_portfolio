"use cache";

import type { Metadata } from "next";
import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export async function generateMetadata(): Promise<Metadata> {
	cachePageLife();
	return {
		title: "Work",
		description:
			"Product design case studies and shipped work by Karthik Panchala — business strategy and product impact.",
		// This route renders the same single-page document as `/`, scrolled to
		// the work section — canonicalize to avoid duplicate-content indexing.
		alternates: { canonical: "/" },
	};
}

export default async function WorkPage() {
	cachePageLife();
	return <SitePage initialSection="work" />;
}

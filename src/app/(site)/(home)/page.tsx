"use cache";

import type { Metadata } from "next";
import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export async function generateMetadata(): Promise<Metadata> {
	cachePageLife();
	return {
		alternates: { canonical: "/" },
	};
}

export default async function Page() {
	cachePageLife();
	return <SitePage initialSection="about" />;
}

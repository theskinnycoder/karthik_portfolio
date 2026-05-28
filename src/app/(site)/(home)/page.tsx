"use cache";

import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export default async function Page() {
	cachePageLife();
	return <SitePage initialSection="about" />;
}

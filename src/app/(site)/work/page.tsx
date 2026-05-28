"use cache";

import { cachePageLife } from "@/lib/caching";
import { SitePage } from "../_components/site-page";

export default async function WorkPage() {
	cachePageLife();
	return <SitePage initialSection="work" />;
}

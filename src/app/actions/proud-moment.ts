"use server";

import type { HighlightDetailDTO } from "@/sanity/lib/dal";
import { getHighlightBySlug } from "@/sanity/lib/dal";

export async function fetchHighlightDetail(
	slug: string,
): Promise<HighlightDetailDTO | null> {
	return getHighlightBySlug(slug);
}

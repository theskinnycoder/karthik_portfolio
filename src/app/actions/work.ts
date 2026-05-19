"use server";

import type { WorkItemDetailDTO } from "@/sanity/lib/dal";
import { getWorkItemBySlug } from "@/sanity/lib/dal";

export async function fetchWorkDetail(
	slug: string,
): Promise<WorkItemDetailDTO | null> {
	return getWorkItemBySlug(slug);
}

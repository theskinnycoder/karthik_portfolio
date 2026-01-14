import "server-only";
import { client } from "./client";
import type { QueryParams } from "sanity";

export async function sanityFetch<T>({
	query,
	params = {},
	tags = [],
}: {
	query: string;
	params?: QueryParams;
	tags?: string[];
}): Promise<T> {
	return client.fetch<T>(query, params, {
		next: { tags },
	});
}

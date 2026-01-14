import type { QueryParams } from "sanity";
import "server-only";
import { client } from "./client";

/**
 * Sanity fetch wrapper
 * **Note**: Caching is handled at the DAL level with "use cache" + cacheTag() + cacheLife()
 */
export async function sanityFetch<T>({
	query,
	params = {},
}: {
	query: string;
	params?: QueryParams;
}): Promise<T> {
	return client.fetch<T>(query, params);
}

import type { QueryParams } from "sanity";
import "server-only";
import { client } from "./client";

export async function sanityFetch<T>({
	query,
	params = {},
}: {
	query: string;
	params?: QueryParams;
}): Promise<T> {
	// Always no-store: the DAL "use cache" boundaries (tagResource / cacheSanityResource)
	// are the single caching layer. Using "force-cache" here created a second cache that
	// was never invalidated by revalidateTag, causing stale data after content updates.
	return client.fetch<T>(query, params, { cache: "no-store" });
}

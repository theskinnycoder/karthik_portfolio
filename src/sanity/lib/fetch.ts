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
	return client.fetch<T>(query, params, {
		cache: "force-cache",
	});
}

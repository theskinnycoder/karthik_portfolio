import type { QueryParams } from "sanity";
import "server-only";
import { client } from "./client";

const isDev = process.env.NODE_ENV === "development";

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
		cache: isDev ? "no-store" : "force-cache",
		next: isDev ? undefined : { tags },
	});
}

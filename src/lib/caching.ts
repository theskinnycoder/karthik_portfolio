import { cacheLife, cacheTag } from "next/cache";

/**
 * Map Sanity document types to cache tags
 * Add new entries when creating new content types in the DAL
 */
export const DOCUMENT_TYPE_TO_TAGS = {
	testimonial: ["testimonials"],
	company: ["companies"],
} as const;

/**
 * Get the cache tags for a given document type
 */
export function getTags(type: keyof typeof DOCUMENT_TYPE_TO_TAGS) {
	return DOCUMENT_TYPE_TO_TAGS[type];
}

/**
 * Default cache life profile for portfolio content
 * - "days": Content updates infrequently (revalidate: 1 day, expire: 1 week)
 */
export const CACHE_LIFE = "days" as const;

/**
 * Apply page-level caching with the default cache life
 * Use at the top of page components after "use cache" directive
 */
export function cachePageLife() {
	cacheLife(CACHE_LIFE);
}

/**
 * Tag a resource with the cache tags for a given document type
 * Applies "use cache" + cacheTag() + cacheLife() pattern
 */
export async function tagResource(type: keyof typeof DOCUMENT_TYPE_TO_TAGS) {
	"use cache";

	cacheLife(CACHE_LIFE);
	cacheTag(getTags(type)[0]);
}

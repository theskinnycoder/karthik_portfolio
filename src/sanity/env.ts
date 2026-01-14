// Support both Next.js (process.env) and standalone Sanity Studio/Vite (import.meta.env)
function getEnvVar(nextKey: string, sanityKey: string): string | undefined {
	// Next.js environment (embedded studio)
	if (typeof process !== "undefined" && process.env?.[nextKey]) {
		return process.env[nextKey];
	}

	// Vite environment (standalone sanity dev)
	// @ts-expect-error - import.meta.env exists in Vite but not in Next.js types
	if (typeof import.meta !== "undefined" && import.meta.env?.[sanityKey]) {
		// @ts-expect-error - import.meta.env exists in Vite
		return import.meta.env[sanityKey] as string;
	}

	return undefined;
}

export const apiVersion =
	getEnvVar("NEXT_PUBLIC_SANITY_API_VERSION", "SANITY_STUDIO_API_VERSION") ||
	"2026-01-14";

export const dataset = assertValue(
	getEnvVar("NEXT_PUBLIC_SANITY_DATASET", "SANITY_STUDIO_DATASET"),
	"Missing environment variable: NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET",
);

export const projectId = assertValue(
	getEnvVar("NEXT_PUBLIC_SANITY_PROJECT_ID", "SANITY_STUDIO_PROJECT_ID"),
	"Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
	if (v === undefined) {
		throw new Error(errorMessage);
	}

	return v;
}

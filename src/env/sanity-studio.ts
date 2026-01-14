/**
 * Vite/standalone Sanity Studio environment fallback
 * Used when running `sanity dev` outside of Next.js
 *
 * This file handles the import.meta.env pattern that Vite uses
 * for environment variables in standalone Sanity Studio mode.
 */

interface ViteEnv {
	SANITY_STUDIO_PROJECT_ID?: string;
	SANITY_STUDIO_DATASET?: string;
	SANITY_STUDIO_API_VERSION?: string;
}

function getViteEnv(): ViteEnv {
	// @ts-expect-error - import.meta.env exists in Vite but not in Next.js types
	if (typeof import.meta !== "undefined" && import.meta.env) {
		// @ts-expect-error - import.meta.env exists in Vite
		return import.meta.env as ViteEnv;
	}
	return {};
}

const viteEnv = getViteEnv();

export const projectId = viteEnv.SANITY_STUDIO_PROJECT_ID;
export const dataset = viteEnv.SANITY_STUDIO_DATASET;
export const apiVersion = viteEnv.SANITY_STUDIO_API_VERSION ?? "2026-01-14";

/**
 * Check if we're running in Vite/standalone mode
 */
export function isViteEnvironment(): boolean {
	return !!(
		typeof import.meta !== "undefined" &&
		// @ts-expect-error - import.meta.env exists in Vite
		import.meta.env?.SANITY_STUDIO_PROJECT_ID
	);
}

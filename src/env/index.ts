/**
 * Unified environment variable exports
 *
 * Auto-detects whether we're in:
 * 1. Next.js environment (embedded studio, SSR, client)
 * 2. Vite environment (standalone sanity dev)
 *
 * Usage:
 *   import { projectId, dataset, apiVersion } from "@/env";
 *
 * For server-only variables:
 *   import { serverEnv } from "@/env/server";
 */

import * as viteEnv from "./sanity-studio";

export { apiVersion, clientEnv, dataset, projectId } from "./client";

/**
 * Get Sanity configuration with dual-environment support
 * Prefers Next.js env, falls back to Vite env for standalone studio
 */
export function getSanityConfig() {
	if (viteEnv.isViteEnvironment()) {
		if (!viteEnv.projectId || !viteEnv.dataset) {
			throw new Error(
				"Missing Vite environment variables: SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET are required",
			);
		}
		return {
			projectId: viteEnv.projectId,
			dataset: viteEnv.dataset,
			apiVersion: viteEnv.apiVersion,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const { clientEnv } = require("./client") as typeof import("./client");
	return {
		projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
		dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
		apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
	};
}

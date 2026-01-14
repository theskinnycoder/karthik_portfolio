/**
 * Sanity environment configuration
 *
 * Supports both:
 * - Next.js (process.env with NEXT_PUBLIC_* prefix via t3-env)
 * - Vite/standalone Sanity Studio (import.meta.env with SANITY_STUDIO_* prefix)
 */

import * as viteEnv from "../env/sanity-studio";

let _clientEnv: typeof import("../env/client").clientEnv | null = null;
function getClientEnv() {
	if (_clientEnv === null && !viteEnv.isViteEnvironment()) {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		_clientEnv = require("../env/client").clientEnv;
	}
	return _clientEnv;
}

function getEnvValue<T>(
	nextJsValue: T | undefined,
	viteValue: T | undefined,
	fallback: T,
): T {
	if (viteEnv.isViteEnvironment() && viteValue !== undefined) {
		return viteValue;
	}
	if (nextJsValue !== undefined) {
		return nextJsValue;
	}
	return fallback;
}

export const apiVersion = getEnvValue(
	getClientEnv()?.NEXT_PUBLIC_SANITY_API_VERSION,
	viteEnv.apiVersion,
	"2026-01-14",
);

export const dataset = (() => {
	const value = getEnvValue(
		getClientEnv()?.NEXT_PUBLIC_SANITY_DATASET,
		viteEnv.dataset,
		undefined,
	);
	if (!value) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET",
		);
	}
	return value;
})();

export const projectId = (() => {
	const value = getEnvValue(
		getClientEnv()?.NEXT_PUBLIC_SANITY_PROJECT_ID,
		viteEnv.projectId,
		undefined,
	);
	if (!value) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID",
		);
	}
	return value;
})();

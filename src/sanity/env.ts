/**
 * Sanity environment configuration
 *
 * Supports:
 * - Next.js (process.env with NEXT_PUBLIC_* prefix via t3-env)
 * - Vite/standalone Sanity Studio (import.meta.env with SANITY_STUDIO_* prefix)
 * - Sanity CLI (plain process.env fallback for schema deploy, etc.)
 */

import * as viteEnv from "../env/sanity-studio";

/**
 * Check if we're running in Sanity CLI context (Node.js CJS without Next.js runtime)
 * This happens during `sanity schema deploy`, `sanity dev`, etc.
 */
function isSanityCLI(): boolean {
	return (
		typeof process !== "undefined" &&
		!viteEnv.isViteEnvironment() &&
		// Sanity CLI runs scripts that don't have Next.js runtime
		(process.env.npm_lifecycle_script?.includes("sanity") ?? false)
	);
}

/**
 * Get env value directly from process.env (for Sanity CLI fallback)
 */
function getProcessEnv(key: string): string | undefined {
	return typeof process !== "undefined" ? process.env[key] : undefined;
}

let _clientEnv: typeof import("../env/client").clientEnv | null = null;
function getClientEnv() {
	// Skip t3-env validation in Sanity CLI context - use process.env directly
	if (isSanityCLI()) {
		return null;
	}
	if (_clientEnv === null && !viteEnv.isViteEnvironment()) {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		_clientEnv = require("../env/client").clientEnv;
	}
	return _clientEnv;
}

function getEnvValue<T>(
	nextJsValue: T | undefined,
	viteValue: T | undefined,
	processEnvValue: T | undefined,
	fallback: T,
): T {
	if (viteEnv.isViteEnvironment() && viteValue !== undefined) {
		return viteValue;
	}
	if (nextJsValue !== undefined) {
		return nextJsValue;
	}
	// Fallback to plain process.env for Sanity CLI
	if (processEnvValue !== undefined) {
		return processEnvValue;
	}
	return fallback;
}

export const apiVersion = getEnvValue(
	getClientEnv()?.NEXT_PUBLIC_SANITY_API_VERSION,
	viteEnv.apiVersion,
	getProcessEnv("NEXT_PUBLIC_SANITY_API_VERSION"),
	"2026-01-14",
);

export const dataset = (() => {
	const value = getEnvValue(
		getClientEnv()?.NEXT_PUBLIC_SANITY_DATASET,
		viteEnv.dataset,
		getProcessEnv("NEXT_PUBLIC_SANITY_DATASET"),
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
		getProcessEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
		undefined,
	);
	if (!value) {
		throw new Error(
			"Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID",
		);
	}
	return value;
})();

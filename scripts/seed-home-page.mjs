#!/usr/bin/env node
/**
 * One-off: seed the homePage singleton at the explicit `homePage` doc id
 * (the desk structure expects that id) with the current section order, then
 * remove a stale draft that an earlier MCP call created with a random uuid.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
	for (const file of [".env.local", ".env"]) {
		try {
			const content = readFileSync(resolve(process.cwd(), file), "utf8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eq = trimmed.indexOf("=");
				if (eq === -1) continue;
				const key = trimmed.slice(0, eq).trim();
				let value = trimmed.slice(eq + 1).trim();
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				if (process.env[key] === undefined) process.env[key] = value;
			}
		} catch {
			// missing file is fine
		}
	}
}

loadEnv();

const projectId =
	process.env.SANITY_API_PROJECT_ID ||
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
	process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
	console.error(
		"Missing SANITY_API_PROJECT_ID / SANITY_API_DATASET / SANITY_API_WRITE_TOKEN",
	);
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: "2026-01-14",
	useCdn: false,
});

const STALE_DRAFT_ID = "drafts.ff4bba73-6b7d-4d02-9932-4a4f451b0131";

async function main() {
	await client.createOrReplace({
		_id: "homePage",
		_type: "homePage",
		sections: ["intro", "experience", "otherWorks", "testimonials"],
	});
	console.log("homePage singleton seeded");

	try {
		await client.delete(STALE_DRAFT_ID);
		console.log(`removed stale draft ${STALE_DRAFT_ID}`);
	} catch (err) {
		// Already gone — fine.
		console.log(`stale draft cleanup skipped: ${err.message}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

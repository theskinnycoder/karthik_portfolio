#!/usr/bin/env node
/**
 * Phase 2 migration. Three discrete jobs:
 *
 *   1. Unset `company.description` on every company doc — the field was
 *      removed from the schema (unused on the site).
 *   2. Convert every `workItem.excerpt` from `text` (string) to a single-
 *      block PortableText array.
 *   3. Convert every `testimonial.quote` from `text` (string) to a single-
 *      block PortableText array.
 *
 * Idempotent — values that are already arrays / already missing are skipped.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
	for (const file of [".env.local", ".env"]) {
		try {
			const path = resolve(process.cwd(), file);
			const content = readFileSync(path, "utf8");
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

function shortKey() {
	return randomUUID().replace(/-/g, "").slice(0, 12);
}

function stringToPortableText(text) {
	return [
		{
			_type: "block",
			_key: shortKey(),
			style: "normal",
			markDefs: [],
			children: [
				{ _type: "span", _key: shortKey(), marks: [], text },
			],
		},
	];
}

async function unsetCompanyDescription() {
	const docs = await client.fetch(
		`*[_type == "company" && defined(description)]{_id}`,
	);
	console.log(`[company.description] ${docs.length} doc(s) to unset`);
	for (const d of docs) {
		await client.patch(d._id).unset(["description"]).commit();
		console.log(`  unset on ${d._id}`);
	}
}

async function convertField(type, field) {
	const docs = await client.fetch(
		`*[_type == $type && defined(${field}) && !defined(${field}[0])]{_id, "value": ${field}}`,
		{ type },
	);
	console.log(`[${type}.${field}] ${docs.length} doc(s) to convert`);
	for (const d of docs) {
		if (typeof d.value !== "string") continue;
		await client
			.patch(d._id)
			.set({ [field]: stringToPortableText(d.value) })
			.commit();
		console.log(`  converted ${d._id}`);
	}
}

async function main() {
	await unsetCompanyDescription();
	await convertField("workItem", "excerpt");
	await convertField("testimonial", "quote");
	console.log("Done.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

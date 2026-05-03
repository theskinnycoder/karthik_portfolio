#!/usr/bin/env node
/**
 * One-off migration: rename the `strong` mark to `colorForeground` across
 * every PortableText field. The base portable-text renderer used to map
 * `strong` to white text — that override was removed in favour of the
 * explicit `colorForeground` decorator. Existing authored content needs
 * the same intent expressed with the new mark name.
 *
 * Run with:
 *   node scripts/migrate-strong-to-color.mjs
 *
 * Reads SANITY_API_PROJECT_ID, SANITY_API_DATASET, SANITY_API_WRITE_TOKEN
 * from .env.local (fallback .env). Idempotent — running again is a no-op.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
	const envFiles = [".env.local", ".env"];
	for (const file of envFiles) {
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
				if (process.env[key] === undefined) {
					process.env[key] = value;
				}
			}
		} catch {
			// file may not exist; that's fine
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

const PT_FIELDS_BY_TYPE = {
	company: ["workDescription"],
	siteProfile: ["bio"],
	workItem: ["content"],
};

/**
 * Replace the `strong` mark with `colorForeground` everywhere it appears in a
 * PortableText array. Returns `null` if nothing changed (the field is left
 * alone). Returns the new array otherwise.
 */
function rewriteBlocks(blocks) {
	if (!Array.isArray(blocks)) return null;
	let changed = false;
	const next = blocks.map((block) => {
		if (!block || block._type !== "block" || !Array.isArray(block.children)) {
			return block;
		}
		const nextChildren = block.children.map((child) => {
			if (
				!child ||
				child._type !== "span" ||
				!Array.isArray(child.marks) ||
				!child.marks.includes("strong")
			) {
				return child;
			}
			changed = true;
			const nextMarks = child.marks.map((m) =>
				m === "strong" ? "colorForeground" : m,
			);
			return { ...child, marks: nextMarks };
		});
		return { ...block, children: nextChildren };
	});
	return changed ? next : null;
}

async function migrateType(type) {
	const fields = PT_FIELDS_BY_TYPE[type];
	const projection = fields.map((f) => f).join(", ");
	const docs = await client.fetch(
		`*[_type == $type && (${fields
			.map((f) => `count(${f}[].children[count(marks[@ == "strong"]) > 0]) > 0`)
			.join(" || ")})]{_id, ${projection}}`,
		{ type },
	);
	console.log(`[${type}] ${docs.length} doc(s) need migration`);

	for (const doc of docs) {
		const patch = client.patch(doc._id);
		let touched = false;
		for (const field of fields) {
			const next = rewriteBlocks(doc[field]);
			if (next) {
				patch.set({ [field]: next });
				touched = true;
			}
		}
		if (!touched) continue;
		await patch.commit();
		console.log(`  patched ${doc._id}`);
		// Sanity exposes a published mirror; the patch above modifies the published
		// doc directly via the write token, so we don't need a separate publish step.
	}
}

async function main() {
	for (const type of Object.keys(PT_FIELDS_BY_TYPE)) {
		await migrateType(type);
	}
	console.log("Done.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

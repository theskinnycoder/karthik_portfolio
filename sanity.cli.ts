import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
	api: { projectId, dataset },
	// Typegen reads all .ts/.tsx files, extracts GROQ queries and defineQuery()
	// calls, and writes typed results next to the schema types.
	typegen: {
		path: "./src/**/*.{ts,tsx}",
		schema: "./schema.json",
		generates: "./sanity.types.ts",
	},
});

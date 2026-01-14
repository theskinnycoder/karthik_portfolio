import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
	client: {
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
		NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
		NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2026-01-14"),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
	},
	emptyStringAsUndefined: true,
});

export const projectId = clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = clientEnv.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = clientEnv.NEXT_PUBLIC_SANITY_API_VERSION;

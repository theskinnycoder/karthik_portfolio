import { createEnv } from "@t3-oss/env-nextjs";
import "server-only";
import { z } from "zod";

export const serverEnv = createEnv({
	server: {
		SANITY_WEBHOOK_SECRET: z.string().min(1).optional(),
		SANITY_API_READ_TOKEN: z.string().min(1).optional(),
		SANITY_API_WRITE_TOKEN: z.string().min(1).optional(),
		SANITY_API_PROJECT_ID: z.string().min(1).optional(),
		SANITY_API_DATASET: z.string().min(1).optional(),

		CLOUDINARY_API_KEY: z.string().min(1).optional(),
		CLOUDINARY_API_SECRET: z.string().min(1).optional(),

		VERCEL_OIDC_TOKEN: z.string().optional(),

		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
	},
	runtimeEnv: {
		SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
		SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
		SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,
		SANITY_API_PROJECT_ID: process.env.SANITY_API_PROJECT_ID,
		SANITY_API_DATASET: process.env.SANITY_API_DATASET,
		CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
		CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
		VERCEL_OIDC_TOKEN: process.env.VERCEL_OIDC_TOKEN,
		NODE_ENV: process.env.NODE_ENV,
	},
	emptyStringAsUndefined: true,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

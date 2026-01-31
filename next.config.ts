import type { NextConfig } from "next";

// Import env to trigger validation at build time
import "./src/env/client";

const nextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	cacheComponents: true,
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
		],
	},
} satisfies NextConfig;

export default nextConfig;

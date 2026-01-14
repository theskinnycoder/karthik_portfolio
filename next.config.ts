import type { NextConfig } from "next";

// Import env to trigger validation at build time
import "./src/env/client";

const nextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	cacheComponents: true,
	reactStrictMode: true,
} satisfies NextConfig;

export default nextConfig;

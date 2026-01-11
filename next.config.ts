import type { NextConfig } from "next";

const nextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	cacheComponents: true,
	reactStrictMode: true,
} satisfies NextConfig;

export default nextConfig;

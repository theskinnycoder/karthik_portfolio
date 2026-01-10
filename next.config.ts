import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	cacheComponents: true,
	reactStrictMode: true,
};

export default nextConfig;

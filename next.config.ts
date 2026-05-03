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
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	async headers() {
		return [
			{
				// Allow Cloudinary resources in Sanity Studio
				source: "/studio/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://widget.cloudinary.com https://media-library.cloudinary.com",
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
							"font-src 'self' https://fonts.gstatic.com",
							"img-src 'self' data: blob: https://res.cloudinary.com https://cdn.sanity.io https://*.cloudinary.com",
							"media-src 'self' blob: https://res.cloudinary.com https://*.cloudinary.com",
							"frame-src 'self' https://widget.cloudinary.com https://media-library.cloudinary.com https://*.cloudinary.com",
							"connect-src 'self' https://*.sanity.io https://*.cloudinary.com https://api.cloudinary.com wss://*.sanity.io",
						].join("; "),
					},
				],
			},
		];
	},
} satisfies NextConfig;

export default nextConfig;

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { caveatFont, interFont } from "@/lib/fonts";

const title = "Karthik Panchala — Product Designer";
const description = "I think about business. Product strategy. Impact.";
const siteUrl = "https://imkarthik.in";
const ogImage = {
	url: "https://res.cloudinary.com/dtay6zw4c/image/upload/v1783319366/Thumbnail_lavvse.png",
	width: 1240,
	height: 504,
	alt: title,
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: title,
		template: "%s — Karthik Panchala",
	},
	description,
	openGraph: {
		title,
		description,
		url: siteUrl,
		siteName: "Karthik Panchala",
		type: "website",
		images: [ogImage],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [ogImage],
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html
			lang="en"
			className={interFont.variable}
			suppressHydrationWarning
		>
			<body
				className={`${interFont.variable} ${caveatFont.variable} dark min-h-dvh overflow-x-hidden overscroll-y-contain antialiased`}
			>
				{children}
			</body>
		</html>
	);
}

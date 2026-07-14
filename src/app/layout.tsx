import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { caveatFont, interFont } from "@/lib/fonts";

const title = "Karthik Panchala — Product Designer";
const description = "I think about business. Product strategy. Impact.";
const siteUrl = "https://imkarthik.in";
const ogImage = {
	url: "https://res.cloudinary.com/dtay6zw4c/image/upload/c_pad,w_1200,h_630,b_black/v1783319366/Thumbnail_lavvse.png",
	width: 1200,
	height: 630,
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
				suppressHydrationWarning
			>
				<SmoothCursor />
				{children}
			</body>
		</html>
	);
}

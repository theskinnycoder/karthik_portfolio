import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { caveatFont, interFont } from "@/lib/fonts";

const title = "Karthik Panchala — Product Designer";
const description = "I think about business. Product strategy. Impact.";
const siteUrl = "https://imkarthik.in";

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
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
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

import { toPlainText } from "@portabletext/toolkit";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { caveatFont, interFont } from "@/lib/fonts";
import { getSiteProfile, getSocials } from "@/sanity/lib/dal";

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
	keywords: [
		"Karthik Panchala",
		"product designer",
		"product design portfolio",
		"UX design",
		"product strategy",
		"design case studies",
	],
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
		},
	},
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

export default async function RootLayout({ children }: PropsWithChildren) {
	const [profile, socials] = await Promise.all([
		getSiteProfile(),
		getSocials(),
	]);

	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: profile ? toPlainText(profile.name) : "Karthik Panchala",
		jobTitle: profile ? toPlainText(profile.title) : "Product Designer",
		url: siteUrl,
		image: ogImage.url,
		sameAs: socials.map((s) => s.href).filter(Boolean),
	};

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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
					}}
				/>
				{children}
			</body>
		</html>
	);
}

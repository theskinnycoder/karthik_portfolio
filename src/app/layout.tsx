import { caveatFont, interFont } from "@/lib/fonts";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "Karthik Portfolio",
	description: "Karthik's Portfolio",
};

type RootLayoutProps = PropsWithChildren;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang="en"
			className={interFont.variable}
			suppressHydrationWarning
		>
			<body
				className={`${interFont.variable} ${caveatFont.variable} dark min-h-dvh overflow-x-hidden overscroll-y-contain antialiased`}
			>
				<NuqsAdapter>{children}</NuqsAdapter>
			</body>
		</html>
	);
}

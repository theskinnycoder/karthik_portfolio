import type { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
import { caveatFont, interFont } from "@/lib/fonts";

type SiteLayoutProps = PropsWithChildren;

export default function SiteLayout({ children }: SiteLayoutProps) {
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
				<Navbar />
			</body>
		</html>
	);
}

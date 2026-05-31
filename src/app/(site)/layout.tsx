import type { ReactNode } from "react";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { caveatFont, interFont } from "@/lib/fonts";

interface SiteLayoutProps {
	children: ReactNode;
	modal: ReactNode;
}

export default function SiteLayout({ children, modal }: SiteLayoutProps) {
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
				{modal}
				<Suspense>
					<Navbar />
				</Suspense>
			</body>
		</html>
	);
}

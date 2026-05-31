import type { ReactNode } from "react";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";

interface SiteLayoutProps {
	children: ReactNode;
	modal: ReactNode;
}

export default function SiteLayout({ children, modal }: SiteLayoutProps) {
	return (
		<>
			{children}
			<Suspense>{modal}</Suspense>
			<Suspense>
				<Navbar />
			</Suspense>
		</>
	);
}

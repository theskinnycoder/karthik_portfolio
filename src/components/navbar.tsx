"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
	{ label: "About", href: "/", section: "about" },
	{ label: "Work", href: "/work", section: "work" },
	{ label: "Blogs", href: "/blogs", section: "blogs" },
] as const;

const PATHNAME_TO_SECTION: Record<string, string> = {
	"/": "about",
	"/work": "work",
	"/blogs": "blogs",
};

export function Navbar() {
	const pathname = usePathname();
	const [activeSection, setActiveSection] = useState(
		PATHNAME_TO_SECTION[pathname] ?? "about",
	);

	useEffect(() => {
		const handler = (e: Event) => {
			const { section } = (e as CustomEvent<{ section: string }>).detail;
			setActiveSection(section);
		};
		window.addEventListener("sectionchange", handler);
		return () => window.removeEventListener("sectionchange", handler);
	}, []);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
		e.preventDefault();
		document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<nav
			data-slot="navbar"
			className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
			aria-label="Main navigation"
		>
			<div className="flex items-center rounded-full border border-border bg-card p-2">
				{NAV_ITEMS.map((item) => {
					const isActive = activeSection === item.section;

					return (
						<a
							key={item.href}
							href={item.href}
							onClick={(e) => handleClick(e, item.section)}
							className={cn(
								"rounded-full px-3.5 py-1.5 text-base font-semibold tracking-[0.32px] transition-colors",
								isActive
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground/80",
							)}
							aria-current={isActive ? "page" : undefined}
						>
							{item.label}
						</a>
					);
				})}
			</div>
		</nav>
	);
}

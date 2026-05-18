"use client";

import { PATHNAME_TO_SECTION, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
	{ label: "About", href: "/", section: "about" },
	{ label: "Work", href: "/work", section: "work" },
	{ label: "Blogs", href: "/blogs", section: "blogs" },
] as const;

export function Navbar() {
	const pathname = usePathname();
	const [activeSection, setActiveSection] = useState(
		PATHNAME_TO_SECTION[pathname] ?? "about",
	);

	useEffect(() => {
		const handler = (e: Event) => {
			const { section } = (e as CustomEvent<{ section: SectionId }>).detail;
			setActiveSection(section);
		};
		window.addEventListener("sectionchange", handler);
		return () => window.removeEventListener("sectionchange", handler);
	}, []);

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement>,
		section: string,
	) => {
		e.preventDefault();
		document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
	};

	const isHidden = activeSection === "about";

	return (
		<nav
			data-slot="navbar"
			className={cn(
				"fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300",
				isHidden
					? "translate-y-20 opacity-0 pointer-events-none"
					: "translate-y-0 opacity-100",
			)}
			aria-label="Main navigation"
			aria-hidden={isHidden}
		>
			<div className="flex items-center rounded-full border border-border bg-black px-[0.875rem] py-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
				{NAV_ITEMS.map((item) => {
					const isActive = activeSection === item.section;

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={(e) => handleClick(e, item.section)}
							className={cn(
								"rounded-full px-3.5 py-1.5 text-lg font-semibold tracking-[0.32px] transition-colors",
								isActive
									? "text-foreground"
									: "text-[oklch(70.94%_0_0)] hover:text-foreground/80",
							)}
							aria-current={isActive ? "page" : undefined}
						>
							{item.label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

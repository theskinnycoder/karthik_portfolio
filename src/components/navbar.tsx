"use client";

import { PATHNAME_TO_SECTION, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
	{ label: "About", href: "/", section: "about" },
	{ label: "Work", href: "/work", section: "work" },
	{ label: "Blogs", href: "/blogs", section: "blogs" },
] as const;

export function Navbar() {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);
	const [activeSection, setActiveSection] = useState(
		PATHNAME_TO_SECTION[pathname] ?? "about",
	);

	// Push the navbar up so it never crosses the footer divider.
	// Maintains a 0.75rem (12px) gap between the divider and the navbar top.
	useEffect(() => {
		const NORMAL_BOTTOM = 24; // 1.5rem in px (bottom-6)
		const GAP = 12; // 0.75rem in px

		const updateBottom = () => {
			const divider = document.getElementById("footer-divider");
			if (!divider || !navRef.current) return;

			const hrTop = divider.getBoundingClientRect().top;
			const computed = window.innerHeight - hrTop + GAP;

			navRef.current.style.bottom = `${Math.max(NORMAL_BOTTOM, computed)}px`;
		};

		window.addEventListener("scroll", updateBottom, { passive: true });
		window.addEventListener("resize", updateBottom, { passive: true });
		updateBottom();

		return () => {
			window.removeEventListener("scroll", updateBottom);
			window.removeEventListener("resize", updateBottom);
		};
	}, []);

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
		const el = document.getElementById(section);
		if (!el) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.scrollIntoView();
			return;
		}

		const startY = window.scrollY;
		const targetY = el.getBoundingClientRect().top + startY;
		const diff = targetY - startY;
		const duration = 700;
		let start: number | null = null;

		const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			window.scrollTo(0, startY + diff * ease(progress));
			if (progress < 1) requestAnimationFrame(step);
		};

		requestAnimationFrame(step);
	};

	return (
		<nav
			ref={navRef}
			data-slot="navbar"
			className="fixed left-1/2 z-50 -translate-x-1/2"
			style={{ bottom: "1.5rem" }}
			aria-label="Main navigation"
		>
			<div className="flex items-center rounded-full border border-border bg-background px-[0.875rem] py-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
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

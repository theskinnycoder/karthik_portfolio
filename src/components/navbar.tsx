"use client";

import { FOOTER_DIVIDER_ID, PATHNAME_TO_SECTION, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
	{ label: "About", href: "/", section: "about" },
	{ label: "Work", href: "/work", section: "work" },
	{ label: "Blogs", href: "/blogs", section: "blogs" },
] as const;

/** px — matches the initial `style={{ bottom: "1.5rem" }}` */
const NORMAL_BOTTOM = 24;
const STYLE_EL_ID = "_navbar_push_style";

export function Navbar() {
	const pathname = usePathname();
	const navRef = useRef<HTMLElement>(null);
	const [activeSection, setActiveSection] = useState(
		PATHNAME_TO_SECTION[pathname] ?? "about",
	);

	// Footer magnet: navbar center tracks the divider line as it scrolls up.
	// Primary  → CSS Scroll-Driven Animation (compositor thread — zero jitter).
	// Fallback → rAF + transform for browsers without SDA support.
	//
	// Note: Tailwind v4's -translate-x-1/2 uses the CSS `translate` property
	// (not `transform`), so our animation's `transform: translateY(...)` composes
	// with it cleanly — no double-translation.
	useEffect(() => {
		const nav = navRef.current;
		if (!nav) return;

		const supportsSDA =
			typeof CSS !== "undefined" &&
			CSS.supports("animation-timeline", "scroll()");

		// Shared <style> element for injected @keyframes
		let styleEl = document.getElementById(STYLE_EL_ID) as HTMLStyleElement | null;
		if (!styleEl) {
			styleEl = document.createElement("style");
			styleEl.id = STYLE_EL_ID;
			document.head.appendChild(styleEl);
		}
		const styleNode = styleEl;

		// Computes scroll positions and wires up the animation.
		// Called once on mount and debounced after resize.
		const setup = () => {
			const divider = document.getElementById(FOOTER_DIVIDER_ID);
			if (!divider) return;

			const vh = window.innerHeight;
			const navH = nav.offsetHeight;
			if (navH === 0) return; // layout not yet measured

			// Absolute Y of the divider from document top
			const dividerAbsY =
				divider.getBoundingClientRect().top + window.scrollY;

			// Scroll offset at which divider center aligns with navbar center
			const scrollStart = Math.max(
				0,
				dividerAbsY - (vh - NORMAL_BOTTOM - navH / 2),
			);
			// Range = vh px → 1 scroll-px maps to exactly 1 transform-px (perfect tracking)
			const scrollEnd = scrollStart + vh;

			styleNode.textContent = `@keyframes _navbar_push {
  from { transform: translateY(0px); }
  to   { transform: translateY(-${vh}px); }
}`;

			if (supportsSDA) {
				nav.style.setProperty("animation-name", "_navbar_push");
				nav.style.setProperty("animation-duration", "auto");
				nav.style.setProperty("animation-timing-function", "linear");
				nav.style.setProperty("animation-fill-mode", "both");
				nav.style.setProperty("animation-timeline", "scroll()");
				nav.style.setProperty(
					"animation-range",
					`${scrollStart}px ${scrollEnd}px`,
				);
			}
		};

		setup();

		let resizeTimer: ReturnType<typeof setTimeout>;
		const onResize = () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(setup, 150);
		};

		if (supportsSDA) {
			window.addEventListener("resize", onResize, { passive: true });
			return () => {
				clearTimeout(resizeTimer);
				window.removeEventListener("resize", onResize);
				[
					"animation-name",
					"animation-duration",
					"animation-timing-function",
					"animation-fill-mode",
					"animation-timeline",
					"animation-range",
				].forEach((p) => nav.style.removeProperty(p));
				styleNode.remove();
			};
		}

		// ── JS fallback (no SDA support) ─────────────────────────────────────
		nav.style.setProperty("will-change", "transform");
		let rafId: number;
		let cachedVh = window.innerHeight;

		const handleScroll = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				const divider = document.getElementById(FOOTER_DIVIDER_ID);
				if (!divider) return;

				const hrTop = divider.getBoundingClientRect().top;
				if (hrTop < 0) return; // iOS rubber-band overscroll

				const navH = nav.offsetHeight;
				const entry = cachedVh - NORMAL_BOTTOM - navH / 2;

				if (hrTop <= entry) {
					nav.style.setProperty(
						"transform",
						`translateY(-${entry - hrTop}px)`,
					);
				} else {
					nav.style.removeProperty("transform");
				}
			});
		};

		const onResizeFallback = () => {
			cachedVh = window.innerHeight;
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(handleScroll, 150);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", onResizeFallback, { passive: true });

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(resizeTimer);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", onResizeFallback);
			nav.style.removeProperty("will-change");
			nav.style.removeProperty("transform");
			styleNode.remove();
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
		const el = document.getElementById(section);
		if (!el) return; // no section in DOM — let the <Link> navigate normally
		e.preventDefault();

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

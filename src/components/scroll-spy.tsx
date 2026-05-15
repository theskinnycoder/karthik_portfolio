"use client";

import { useEffect, useRef } from "react";

const SECTION_URLS: Record<string, string> = {
	about: "/",
	work: "/work",
	blogs: "/blogs",
};

const SECTIONS = ["about", "work", "blogs"] as const;

export function ScrollSpy({ initialSection = "about" }: { initialSection?: string }) {
	const currentRef = useRef(initialSection);

	useEffect(() => {
		// Instant scroll to the correct section when landing directly on /work or /blogs
		if (initialSection !== "about") {
			document.getElementById(initialSection)?.scrollIntoView({ behavior: "instant" });
		}

		// Notify navbar of the initial active section
		window.dispatchEvent(
			new CustomEvent("sectionchange", { detail: { section: initialSection } }),
		);

		const handleScroll = () => {
			// The active section is the last one whose top edge is above 40% of the viewport
			const midpoint = window.innerHeight * 0.4;
			let active = "about";

			for (const id of SECTIONS) {
				const el = document.getElementById(id);
				if (!el) continue;
				if (el.getBoundingClientRect().top <= midpoint) active = id;
			}

			if (active !== currentRef.current) {
				currentRef.current = active;
				history.pushState(null, "", SECTION_URLS[active] ?? "/");
				window.dispatchEvent(
					new CustomEvent("sectionchange", { detail: { section: active } }),
				);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [initialSection]);

	return null;
}

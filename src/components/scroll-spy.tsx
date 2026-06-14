"use client";

import { SECTION_URLS, SECTIONS, type SectionId } from "@/lib/sections";
import { useEffect, useRef } from "react";

export function ScrollSpy({
	initialSection = "about",
}: {
	initialSection?: string;
}) {
	const currentRef = useRef(initialSection);

	useEffect(() => {
		if (initialSection !== "about") {
			document
				.getElementById(initialSection)
				?.scrollIntoView({ behavior: "instant" });
		}

		window.dispatchEvent(
			new CustomEvent("sectionchange", { detail: { section: initialSection } }),
		);

		const threshold = window.innerHeight * 0.7;

		const handleScroll = () => {
			let active: SectionId = "about";
			let activeTop = -Infinity;

			// Pick the section closest to (but not past) the threshold from above —
			// i.e. the bottom-most section already scrolled into view. Comparing by
			// actual position keeps this correct regardless of the SECTIONS array
			// order or how sections are reordered in the CMS.
			for (const id of SECTIONS) {
				const el = document.getElementById(id);
				if (!el) continue;
				const top = el.getBoundingClientRect().top;
				if (top <= threshold && top > activeTop) {
					active = id;
					activeTop = top;
				}
			}

			if (active !== currentRef.current) {
				currentRef.current = active;
				history.replaceState(null, "", SECTION_URLS[active]);
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

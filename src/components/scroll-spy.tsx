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

		const threshold = window.innerHeight * 0.4;

		const handleScroll = () => {
			let active: SectionId = "about";

			for (const id of SECTIONS) {
				const el = document.getElementById(id);
				if (!el) continue;
				if (el.getBoundingClientRect().top <= threshold) active = id;
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

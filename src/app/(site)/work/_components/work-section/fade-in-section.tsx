"use client";

import { useEffect, useRef } from "react";

interface FadeInSectionProps {
	children: React.ReactNode;
}

export function FadeInSection({ children }: FadeInSectionProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const raf = requestAnimationFrame(() => {
			const rect = el.getBoundingClientRect();
			const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

			// If already in the viewport (e.g. scrolled here programmatically), don't animate
			if (alreadyVisible) return;

			// Start hidden
			el.style.opacity = "0";
			el.style.transform = "translateY(40px)";

			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						el.style.transition =
							"opacity 1.2s ease-out, transform 1.2s ease-out";
						el.style.opacity = "1";
						el.style.transform = "translateY(0)";
						observer.disconnect();
					}
				},
				{ threshold: 0 },
			);

			observer.observe(el);
		});

		return () => cancelAnimationFrame(raf);
	}, []);

	return <div ref={ref}>{children}</div>;
}

"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface AutoScrollNextProps {
	href: Route;
	threshold?: number;
}

/**
 * Pushes the user to `href` once they've reached the bottom of the page and
 * continued to scroll downward past `threshold` pixels of cumulative intent.
 * Disabled under prefers-reduced-motion. Renders nothing.
 */
export function AutoScrollNext({ href, threshold = 300 }: AutoScrollNextProps) {
	const router = useRouter();

	useEffect(() => {
		if (
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		router.prefetch(href);

		let cumulative = 0;
		let bottomSince: number | null = null;
		let navigated = false;
		const settleMs = 250;

		function isAtBottom() {
			return (
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 1
			);
		}

		function accumulate(deltaY: number) {
			if (navigated) return;
			if (!isAtBottom()) {
				cumulative = 0;
				bottomSince = null;
				return;
			}
			if (bottomSince === null) bottomSince = Date.now();
			// Ignore the momentum tail of the scroll that brought them here.
			if (Date.now() - bottomSince < settleMs) return;
			if (deltaY > 0) {
				cumulative += deltaY;
				if (cumulative >= threshold) {
					navigated = true;
					startTransition(() => router.push(href));
				}
			} else if (deltaY < 0) {
				cumulative = Math.max(0, cumulative + deltaY);
			}
		}

		function onWheel(e: WheelEvent) {
			accumulate(e.deltaY);
		}

		let lastTouchY: number | null = null;
		function onTouchStart(e: TouchEvent) {
			lastTouchY = e.touches[0]?.clientY ?? null;
		}
		function onTouchMove(e: TouchEvent) {
			const y = e.touches[0]?.clientY;
			if (y == null) return;
			if (lastTouchY != null) accumulate(lastTouchY - y);
			lastTouchY = y;
		}
		function onTouchEnd() {
			lastTouchY = null;
		}

		window.addEventListener("wheel", onWheel, { passive: true });
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		window.addEventListener("touchcancel", onTouchEnd, { passive: true });

		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("touchcancel", onTouchEnd);
		};
	}, [href, threshold, router]);

	return null;
}

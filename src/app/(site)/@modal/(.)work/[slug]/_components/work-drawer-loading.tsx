"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import { DrawerSkeleton } from "./drawer-skeleton";

const LOADING_SHOWN_KEY = "vaul-loading-shown";
const CLOSE_ANIMATION_FALLBACK_MS = 600;

export function WorkDrawerLoading() {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cancel any pending router.back() when Next.js replaces this loading
	// component with WorkModalDrawer (data arrived).
	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== null) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	function handleClose() {
		if (!open) return;
		setOpen(false);
		if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		closeTimerRef.current = setTimeout(() => router.back(), CLOSE_ANIMATION_FALLBACK_MS);
	}

	return (
		<Drawer
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
			onAnimationEnd={(isOpen) => {
				// Only set the flag once the skeleton's open animation fully completes.
				// If data arrives before this fires (fast load), the flag is never set
				// and WorkModalDrawer plays its own entrance animation normally.
				// If the skeleton fully opens first (slow load), the flag suppresses
				// WorkModalDrawer's duplicate animation.
				if (isOpen) sessionStorage.setItem(LOADING_SHOWN_KEY, "1");
			}}
		>
			<DrawerContent
				data-theme="work-detail"
				className="mt-0 h-dvh max-h-none p-0 bg-background before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<DrawerTitle className="sr-only">Loading…</DrawerTitle>
				<div className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground">
					<DrawerBackHeader onBack={handleClose} />
					<DrawerSkeleton />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export { CLOSE_ANIMATION_FALLBACK_MS, LOADING_SHOWN_KEY };

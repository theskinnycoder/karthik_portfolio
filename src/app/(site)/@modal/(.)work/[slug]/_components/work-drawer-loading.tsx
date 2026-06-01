"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import { DrawerSkeleton } from "./drawer-skeleton";

const LOADING_SHOWN_KEY = "vaul-loading-shown";
const CLOSE_ANIMATION_FALLBACK_MS = 600;

export function WorkDrawerLoading() {
	const router = useRouter();
	// Start open immediately — vaul's CSS animation fires on data-state=open mount.
	const [open, setOpen] = useState(true);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// useLayoutEffect fires during the commit phase, before any passive effects
	// run — guaranteed to execute before WorkModalDrawer's useState initializer
	// reads the flag in the next render cycle triggered by data arriving.
	useLayoutEffect(() => {
		sessionStorage.setItem(LOADING_SHOWN_KEY, "1");
	}, []);

	// Cancel any pending router.push when Next.js replaces this loading component
	// with the real WorkModalDrawer (data arrived). Without this, the stale timer
	// would fire after the modal is already open and navigate the user away.
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

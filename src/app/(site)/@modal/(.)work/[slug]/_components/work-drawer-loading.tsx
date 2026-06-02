"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import { setWorkDrawerSignal } from "@/lib/work-drawer-signal";
import { DrawerSkeleton } from "./drawer-skeleton";

const CLOSE_ANIMATION_FALLBACK_MS = 600;

export function WorkDrawerLoading() {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Belt-and-suspenders: the card's onClick already set the signal before
	// navigation, but if WorkDrawerLoading mounts it sets it again (idempotent).
	useLayoutEffect(() => {
		setWorkDrawerSignal();
	}, []);

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
		closeTimerRef.current = setTimeout(
			() => router.back(),
			CLOSE_ANIMATION_FALLBACK_MS,
		);
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
				className="mt-0 h-dvh max-h-none bg-background p-0 before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<DrawerTitle className="sr-only">Loading…</DrawerTitle>
				<DrawerDescription className="sr-only">
					Loading case study details.
				</DrawerDescription>
				<div className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground">
					<DrawerBackHeader onBack={handleClose} />
					<DrawerSkeleton />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export { CLOSE_ANIMATION_FALLBACK_MS };

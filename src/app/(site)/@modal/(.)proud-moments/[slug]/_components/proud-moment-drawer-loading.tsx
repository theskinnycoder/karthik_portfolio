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
import { setProudMomentDrawerSignal } from "@/lib/proud-moment-drawer-signal";
import { DrawerSkeleton } from "./drawer-skeleton";

const CLOSE_ANIMATION_FALLBACK_MS = 600;

export function ProudMomentDrawerLoading() {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Belt-and-suspenders: the card's onClick already set the signal before
	// navigation, but if this loader mounts it sets it again (idempotent).
	useLayoutEffect(() => {
		setProudMomentDrawerSignal();
	}, []);

	// Cancel any pending router.back() when Next.js replaces this loading
	// component with the modal drawer (data arrived).
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
					Loading proud moment details.
				</DrawerDescription>
				<div className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground">
					<DrawerBackHeader
						onBack={handleClose}
						label="Back to Proud Moment(s)"
					/>
					<DrawerSkeleton />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export { CLOSE_ANIMATION_FALLBACK_MS };

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { DrawerSkeleton } from "./drawer-skeleton";

const LOADING_SHOWN_KEY = "vaul-loading-shown";

export function WorkDrawerLoading() {
	const router = useRouter();
	// Start open immediately — vaul's CSS animation fires on data-state=open mount.
	const [open, setOpen] = useState(true);

	// useLayoutEffect fires during the commit phase, before any passive effects
	// run — guaranteed to execute before WorkModalDrawer's useState initializer
	// reads the flag in the next render cycle triggered by data arriving.
	useLayoutEffect(() => {
		sessionStorage.setItem(LOADING_SHOWN_KEY, "1");
	}, []);

	function handleClose() {
		setOpen(false);
		setTimeout(() => router.push("/work"), 500);
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
					<header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/75 backdrop-blur-md">
						<div className="mx-auto flex w-full max-w-2xl items-center px-6 py-3.5">
							<button
								onClick={handleClose}
								className="group inline-flex w-fit items-center gap-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
							>
								<span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-95">
									<ArrowLeft className="size-4" />
								</span>
								Back to Work
							</button>
						</div>
					</header>

					<DrawerSkeleton />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export { LOADING_SHOWN_KEY };

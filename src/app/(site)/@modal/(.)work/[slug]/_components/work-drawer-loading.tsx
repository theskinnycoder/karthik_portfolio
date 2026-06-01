"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

const LOADING_SHOWN_KEY = "vaul-loading-shown";

export function WorkDrawerLoading() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	// Set synchronously during render — useEffect may not fire before React
	// replaces this loading fallback with WorkModalDrawer, so we need the
	// flag in place before the replacement component's useState initializer runs.
	sessionStorage.setItem(LOADING_SHOWN_KEY, "1");

	useEffect(() => {
		setOpen(true);
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

					<div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-6 pt-10 pb-24">
						{[100, 70, 90, 50, 80, 60, 100, 75].map((w, i) => (
							<div
								key={i}
								className="h-5 animate-pulse rounded-md bg-foreground/10"
								style={{ width: `${w}%` }}
							/>
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export { LOADING_SHOWN_KEY };

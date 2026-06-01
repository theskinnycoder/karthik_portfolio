"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { fetchWorkDetail } from "@/app/actions/work";
import { WorkArticle } from "@/app/(work-detail)/work/[slug]/_components/work-article";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { WorkItemDetailDTO, WorkNavLinkDTO } from "@/sanity/lib/dal";
import { DrawerSkeleton } from "./drawer-skeleton";
import { LOADING_SHOWN_KEY } from "./work-drawer-loading";

interface WorkModalDrawerProps {
	work: WorkItemDetailDTO;
}

export function WorkModalDrawer({ work: initialWork }: WorkModalDrawerProps) {
	const router = useRouter();
	// Read the flag once, synchronously, to know if the loading skeleton was shown.
	const [skeletonWasShown] = useState(() => {
		const skip = sessionStorage.getItem(LOADING_SHOWN_KEY);
		if (skip) sessionStorage.removeItem(LOADING_SHOWN_KEY);
		return !!skip;
	});
	const [open, setOpen] = useState(true);
	const [work, setWork] = useState(initialWork);
	const [isPending, startTransition] = useTransition();
	const scrollRef = useRef<HTMLDivElement>(null);
	const drawerContentRef = useRef<HTMLDivElement>(null);
	// Tracks a pending close-navigation timer so it can be cancelled on unmount.
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// When the loading skeleton already animated the drawer open, mark the
	// DrawerContent element so the CSS rule in globals.css can suppress vaul's
	// slideFromBottom animation (scoped to data-state=open, so the slideToBottom
	// close animation is unaffected). This runs before first paint, so the
	// attribute is present when the browser applies the initial CSS.
	useLayoutEffect(() => {
		if (skeletonWasShown) {
			drawerContentRef.current?.setAttribute("data-no-open-anim", "");
		}
	}, [skeletonWasShown]);

	// Cancel any pending router.push on unmount to prevent a stale timer from
	// navigating away after Next.js has already replaced this component.
	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== null) {
				clearTimeout(closeTimerRef.current);
			}
		};
	}, []);

	function handleClose() {
		// Guard: vaul can call onOpenChange(false) more than once (swipe + outside
		// click). Ignore if we are already in the closing sequence.
		if (!open) return;
		setOpen(false);
		// Clear any prior pending timer, then set a new one.
		// Navigation is triggered via onAnimationEnd on the Drawer (see below);
		// the 600 ms timer is only a fallback for reduced-motion environments.
		if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		closeTimerRef.current = setTimeout(() => router.back(), 600);
	}

	function navigateTo(slug: string) {
		startTransition(async () => {
			const next = await fetchWorkDetail(slug);
			if (!next) return;
			setWork(next);
			scrollRef.current?.scrollTo({ top: 0 });
			// Patch URL without triggering a Next.js navigation — keeps the
			// drawer mounted so no re-animation plays.
			window.history.replaceState(null, "", `/work/${slug}`);
		});
	}

	return (
		<Drawer
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
			onAnimationEnd={(isOpen) => {
				// Navigate as soon as vaul's close animation actually finishes,
				// then cancel the fallback timer so it doesn't double-fire.
				if (!isOpen) {
					if (closeTimerRef.current !== null) {
						clearTimeout(closeTimerRef.current);
						closeTimerRef.current = null;
					}
					router.back();
				}
			}}
		>
			<DrawerContent
				ref={drawerContentRef}
				data-theme="work-detail"
				className="mt-0 h-dvh max-h-none p-0 bg-background before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<DrawerTitle className="sr-only">Case Study</DrawerTitle>
				<div
					ref={scrollRef}
					className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground"
				>
					<header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/75 backdrop-blur-md">
						<div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3.5">
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

					{isPending ? (
						<DrawerSkeleton />
					) : (
						<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem]">
							<WorkArticle
								work={work}
								hideNav
							/>
							{(work.prev ?? work.next) && (
								<ModalPrevNext
									prev={work.prev}
									next={work.next}
									onNavigate={navigateTo}
								/>
							)}
						</main>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface ModalPrevNextProps {
	prev: WorkNavLinkDTO | null;
	next: WorkNavLinkDTO | null;
	onNavigate: (slug: string) => void;
}

function ModalPrevNext({ prev, next, onNavigate }: ModalPrevNextProps) {
	const justify =
		prev && next ? "justify-between" : next ? "justify-end" : "justify-start";

	return (
		<nav
			aria-label="Case study navigation"
			className={`-mx-6 flex items-center border-t border-border px-6 pt-4 pb-6 ${justify}`}
		>
			{prev && (
				<button
					onClick={() => onNavigate(prev.slug)}
					className="flex min-h-16 flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]"
				>
					<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
						<ArrowLeft className="size-3" />
						Previous
					</span>
					<span className="w-full truncate text-base leading-snug font-semibold text-[#141414]">
						{prev.title}
					</span>
				</button>
			)}
			{next && (
				<button
					onClick={() => onNavigate(next.slug)}
					className="flex min-h-16 flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]"
				>
					<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
						Next
						<ArrowRight className="size-3" />
					</span>
					<span className="w-full truncate text-base leading-snug font-semibold text-[#141414]">
						{next.title}
					</span>
				</button>
			)}
		</nav>
	);
}

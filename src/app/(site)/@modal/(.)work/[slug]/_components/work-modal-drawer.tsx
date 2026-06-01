"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { fetchWorkDetail } from "@/app/actions/work";
import { WorkArticle } from "@/app/(work-detail)/work/[slug]/_components/work-article";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { WorkItemDetailDTO, WorkNavLinkDTO } from "@/sanity/lib/dal";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import { DrawerSkeleton } from "./drawer-skeleton";
import { CLOSE_ANIMATION_FALLBACK_MS, LOADING_SHOWN_KEY } from "./work-drawer-loading";

interface WorkModalDrawerProps {
	work: WorkItemDetailDTO;
}

// Read and consume the skeleton-shown flag. Returns true if the loading
// skeleton played for this open, clearing the flag as a side effect so it
// is never double-consumed across renders.
function consumeSkeletonFlag(): boolean {
	if (typeof window === "undefined") return false;
	const wasShown = !!sessionStorage.getItem(LOADING_SHOWN_KEY);
	if (wasShown) sessionStorage.removeItem(LOADING_SHOWN_KEY);
	return wasShown;
}

export function WorkModalDrawer({ work: initialWork }: WorkModalDrawerProps) {
	const router = useRouter();
	const pathname = usePathname();

	const [open, setOpen] = useState(true);
	const [work, setWork] = useState(initialWork);
	const [isPending, startTransition] = useTransition();

	// Suppress the entrance animation when the loading skeleton already animated
	// the drawer open. Reset to false on close so any subsequent reopen always
	// gets its entrance animation back.
	const [suppressOpenAnim, setSuppressOpenAnim] = useState(consumeSkeletonFlag);

	const scrollRef = useRef<HTMLDivElement>(null);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cancel any pending close-navigation timer on unmount.
	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		};
	}, []);

	// When the drawer closes, reset the animation-suppress flag so the next
	// open (same-card reopen) plays the entrance animation correctly.
	useEffect(() => {
		if (!open) setSuppressOpenAnim(false);
	}, [open]);

	// Same-card reopen: Next.js may reuse this component instance when the user
	// navigates back to the same slug. Detect the pathname returning to our slug
	// while the drawer is closed, re-read the skeleton flag (WorkDrawerLoading
	// sets it in its own useLayoutEffect before this fires), and reopen.
	useLayoutEffect(() => {
		if (pathname === `/work/${work.slug}` && !open) {
			setSuppressOpenAnim(consumeSkeletonFlag());
			setOpen(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps -- pathname is the only trigger; open and work.slug are guards, not reactive dependencies
	}, [pathname]);

	function handleClose() {
		// Guard against vaul firing onOpenChange(false) more than once.
		if (!open) return;
		// Ghost drawers from a previous card must not trigger navigation.
		if (pathname !== `/work/${work.slug}`) return;

		setOpen(false);
		if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		// Fallback for reduced-motion environments where onAnimationEnd never fires.
		closeTimerRef.current = setTimeout(() => router.back(), CLOSE_ANIMATION_FALLBACK_MS);
	}

	function navigateTo(slug: string) {
		startTransition(async () => {
			const next = await fetchWorkDetail(slug);
			if (!next) return;
			setWork(next);
			scrollRef.current?.scrollTo({ top: 0 });
			// Patch the URL without a Next.js navigation to keep the drawer mounted.
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
				// Navigate as soon as vaul's close animation finishes, then cancel
				// the fallback timer so it does not double-fire.
				if (!isOpen && pathname === `/work/${work.slug}`) {
					if (closeTimerRef.current !== null) {
						clearTimeout(closeTimerRef.current);
						closeTimerRef.current = null;
					}
					router.back();
				}
			}}
		>
			<DrawerContent
				data-theme="work-detail"
				{...(suppressOpenAnim ? { "data-no-open-anim": "" } : {})}
				className="mt-0 h-dvh max-h-none p-0 bg-background before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<DrawerTitle className="sr-only">Case Study</DrawerTitle>
				<div
					ref={scrollRef}
					className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground"
				>
					<DrawerBackHeader onBack={handleClose} />

					{isPending ? (
						<DrawerSkeleton />
					) : (
						<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem]">
							<WorkArticle work={work} hideNav />
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

// ─── Prev / Next navigation ───────────────────────────────────────────────────

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
				<NavButton
					label="Previous"
					title={prev.title}
					icon={<ArrowLeft className="size-3" />}
					iconPosition="left"
					onClick={() => onNavigate(prev.slug)}
				/>
			)}
			{next && (
				<NavButton
					label="Next"
					title={next.title}
					icon={<ArrowRight className="size-3" />}
					iconPosition="right"
					onClick={() => onNavigate(next.slug)}
				/>
			)}
		</nav>
	);
}

interface NavButtonProps {
	label: string;
	title: string;
	icon: React.ReactNode;
	iconPosition: "left" | "right";
	onClick: () => void;
}

function NavButton({ label, title, icon, iconPosition, onClick }: NavButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex min-h-16 flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]"
		>
			<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
				{iconPosition === "left" && icon}
				{label}
				{iconPosition === "right" && icon}
			</span>
			<span className="w-full truncate text-base leading-snug font-semibold text-[#141414]">
				{title}
			</span>
		</button>
	);
}

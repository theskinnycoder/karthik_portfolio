"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { fetchWorkDetail } from "@/app/actions/work";
import { WorkArticle } from "@/app/(work-detail)/work/[slug]/_components/work-article";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { WorkItemDetailDTO, WorkNavLinkDTO } from "@/sanity/lib/dal";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import { consumeWorkDrawerSignal } from "@/lib/work-drawer-signal";
import { DrawerSkeleton } from "./drawer-skeleton";
import { CLOSE_ANIMATION_FALLBACK_MS } from "./work-drawer-loading";

interface WorkModalDrawerProps {
	work: WorkItemDetailDTO;
}

export function WorkModalDrawer({ work: initialWork }: WorkModalDrawerProps) {
	const router = useRouter();
	const pathname = usePathname();

	const [open, setOpen] = useState(true);
	const [work, setWork] = useState(initialWork);
	const [isPending, startTransition] = useTransition();

	// False by default. Set true (synchronously before first paint) when the
	// loading skeleton already slid the drawer open, preventing a double slide-up.
	// Reset to false on close so any subsequent reopen gets its animation back.
	const [suppressOpenAnim, setSuppressOpenAnim] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Guards the pathname-based reopen so it never fires on a fresh mount
	// (where open starts true), only after a real close has happened.
	const hasClosedRef = useRef(false);
	// Incremented each time navigateTo() is called or a reopen resets work state.
	// The navigateTo closure captures the value at call time and bails out if it
	// has since changed, preventing stale fetches from overwriting state.
	const navGenerationRef = useRef(0);

	// Cancel any pending close-navigation timer on unmount.
	useEffect(() => {
		return () => {
			if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		};
	}, []);

	// On initial mount: consume the navigation signal set by the card's onClick
	// (and redundantly by WorkDrawerLoading when it renders). Suppresses the
	// slide-up animation so it doesn't replay over already-visible cached content.
	useLayoutEffect(() => {
		if (consumeWorkDrawerSignal()) setSuppressOpenAnim(true);
	}, []);

	// When the drawer closes: mark that a close has occurred (enables the
	// pathname-based reopen below) and reset the animation suppress flag.
	useEffect(() => {
		if (!open) {
			hasClosedRef.current = true;
			setSuppressOpenAnim(false);
		}
	}, [open]);

	// Same-card reopen: Next.js may reuse this component instance when the user
	// navigates back to the same slug. Detect the pathname returning to our slug
	// while the drawer is closed, consume the navigation signal (set by the
	// card's onClick before the navigation fired), and reopen.
	// hasClosedRef prevents this from triggering on the initial mount.
	//
	// We check initialWork.slug (the server-provided slug) rather than work.slug
	// (the client state). After navigateTo(), work.slug drifts to the navigated
	// card — if the user then closes and immediately re-clicks the original card
	// before router.back() completes, React reconciles this instance with the new
	// initialWork prop. Using initialWork.slug ensures the reopen fires correctly
	// and we reset the stale work state before re-opening.
	useLayoutEffect(() => {
		if (
			pathname === `/work/${initialWork.slug}` &&
			!open &&
			hasClosedRef.current
		) {
			if (work.slug !== initialWork.slug) {
				// navigateTo() left stale work state and a stale browser URL.
				// Increment the generation to discard any in-flight navigateTo fetch,
				// reset work to the server-provided data, and restore the URL so that
				// handleClose's window.location.pathname guard stays consistent.
				navGenerationRef.current++;
				setWork(initialWork);
				window.history.replaceState(null, "", `/work/${initialWork.slug}`);
			}
			setSuppressOpenAnim(consumeWorkDrawerSignal());
			setOpen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- pathname is the only trigger; open/initialWork/work/hasClosedRef are guards read at trigger time
	}, [pathname]);

	function handleClose() {
		// Guard against vaul firing onOpenChange(false) more than once.
		if (!open) return;
		// Ghost drawers from a previous card must not trigger navigation.
		// Use window.location.pathname — navigateTo() patches the URL via
		// replaceState which does NOT update usePathname(), so `pathname` would
		// be stale after any prev/next navigation.
		if (window.location.pathname !== `/work/${work.slug}`) return;

		setOpen(false);
		if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		// Fallback for reduced-motion environments where onAnimationEnd never fires.
		// Null the ref before calling router.back() so that if onAnimationEnd also
		// fires afterward it sees a null ref and skips the duplicate navigation.
		closeTimerRef.current = setTimeout(() => {
			closeTimerRef.current = null;
			router.back();
		}, CLOSE_ANIMATION_FALLBACK_MS);
	}

	function navigateTo(slug: string) {
		const generation = ++navGenerationRef.current;
		startTransition(async () => {
			const next = await fetchWorkDetail(slug);
			// Bail out if a reopen or newer navigateTo superseded this call.
			if (!next || generation !== navGenerationRef.current) return;
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
				// Same window.location.pathname rationale as handleClose above.
				if (!isOpen && window.location.pathname === `/work/${work.slug}`) {
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
				className="mt-0 h-dvh max-h-none bg-background p-0 before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<DrawerTitle className="sr-only">Case Study</DrawerTitle>
				<DrawerDescription className="sr-only">
					Detailed case study of the selected work.
				</DrawerDescription>
				<div
					ref={scrollRef}
					className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground"
				>
					<DrawerBackHeader onBack={handleClose} />

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

// ─── Prev / Next navigation ───────────────────────────────────────────────────

interface ModalPrevNextProps {
	prev: WorkNavLinkDTO | null;
	next: WorkNavLinkDTO | null;
	onNavigate: (slug: string) => void;
}

function ModalPrevNext({ prev, next, onNavigate }: ModalPrevNextProps) {
	return (
		<nav
			aria-label="Case study navigation"
			className="-mx-6 grid grid-cols-2 items-stretch gap-3 border-t border-border px-6 pt-4 pb-6"
		>
			<div className="flex">
				{prev && (
					<NavButton
						label="Previous"
						title={prev.title}
						icon={<ArrowLeft className="size-3" />}
						iconPosition="left"
						onClick={() => onNavigate(prev.slug)}
					/>
				)}
			</div>
			<div className="flex justify-end">
				{next && (
					<NavButton
						label="Next"
						title={next.title}
						icon={<ArrowRight className="size-3" />}
						iconPosition="right"
						onClick={() => onNavigate(next.slug)}
					/>
				)}
			</div>
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

function NavButton({
	label,
	title,
	icon,
	iconPosition,
	onClick,
}: NavButtonProps) {
	const isRight = iconPosition === "right";
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex min-h-16 w-full min-w-0 cursor-pointer flex-col justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]",
				isRight ? "items-end text-right" : "items-start text-left",
			)}
		>
			<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
				{!isRight && icon}
				{label}
				{isRight && icon}
			</span>
			<span className="w-full truncate text-base leading-snug font-semibold text-[#141414]">
				{title}
			</span>
		</button>
	);
}

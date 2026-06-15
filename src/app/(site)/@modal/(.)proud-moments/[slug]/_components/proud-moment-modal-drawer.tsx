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
import { fetchHighlightDetail } from "@/app/actions/proud-moment";
import { ProudMomentArticle } from "@/app/(proud-moment-detail)/proud-moments/[slug]/_components/proud-moment-article";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from "@/components/ui/drawer";
import { consumeProudMomentDrawerSignal } from "@/lib/proud-moment-drawer-signal";
import { cn } from "@/lib/utils";
import type { HighlightDetailDTO, HighlightNavLinkDTO } from "@/sanity/lib/dal";
import { DrawerSkeleton } from "./drawer-skeleton";
import { CLOSE_ANIMATION_FALLBACK_MS } from "./proud-moment-drawer-loading";

interface ProudMomentModalDrawerProps {
	highlight: HighlightDetailDTO;
}

export function ProudMomentModalDrawer({
	highlight: initialHighlight,
}: ProudMomentModalDrawerProps) {
	const router = useRouter();
	const pathname = usePathname();

	const [open, setOpen] = useState(true);
	const [highlight, setHighlight] = useState(initialHighlight);
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
	// Incremented each time navigateTo() is called or a reopen resets state.
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
	// (and redundantly by the loader when it renders). Suppresses the slide-up
	// animation so it doesn't replay over already-visible cached content.
	useLayoutEffect(() => {
		if (consumeProudMomentDrawerSignal()) setSuppressOpenAnim(true);
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
	// while the drawer is closed, consume the navigation signal, and reopen.
	// We check initialHighlight.slug (server-provided) rather than the client
	// state because navigateTo() drifts the client slug to the navigated card.
	useLayoutEffect(() => {
		if (
			pathname === `/proud-moments/${initialHighlight.slug}` &&
			!open &&
			hasClosedRef.current
		) {
			if (highlight.slug !== initialHighlight.slug) {
				navGenerationRef.current++;
				setHighlight(initialHighlight);
				window.history.replaceState(
					null,
					"",
					`/proud-moments/${initialHighlight.slug}`,
				);
			}
			setSuppressOpenAnim(consumeProudMomentDrawerSignal());
			setOpen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- pathname is the only trigger; other values are guards read at trigger time
	}, [pathname]);

	function handleClose() {
		// Guard against vaul firing onOpenChange(false) more than once.
		if (!open) return;
		// Ghost drawers from a previous card must not trigger navigation.
		// Use window.location.pathname — navigateTo() patches the URL via
		// replaceState which does NOT update usePathname(), so `pathname` would
		// be stale after any prev/next navigation.
		if (window.location.pathname !== `/proud-moments/${highlight.slug}`) return;

		setOpen(false);
		if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
		closeTimerRef.current = setTimeout(() => {
			closeTimerRef.current = null;
			router.back();
		}, CLOSE_ANIMATION_FALLBACK_MS);
	}

	function navigateTo(slug: string) {
		const generation = ++navGenerationRef.current;
		startTransition(async () => {
			const next = await fetchHighlightDetail(slug);
			// Bail out if a reopen or newer navigateTo superseded this call.
			if (!next || generation !== navGenerationRef.current) return;
			setHighlight(next);
			scrollRef.current?.scrollTo({ top: 0 });
			// Patch the URL without a Next.js navigation to keep the drawer mounted.
			window.history.replaceState(null, "", `/proud-moments/${slug}`);
		});
	}

	return (
		<Drawer
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleClose();
			}}
			onAnimationEnd={(isOpen) => {
				if (
					!isOpen &&
					window.location.pathname === `/proud-moments/${highlight.slug}`
				) {
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
				<DrawerTitle className="sr-only">Proud Moment</DrawerTitle>
				<DrawerDescription className="sr-only">
					Details of the selected proud moment.
				</DrawerDescription>
				<div
					ref={scrollRef}
					className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground"
				>
					<DrawerBackHeader
						onBack={handleClose}
						label="Back to Proud Moment(s)"
					/>

					{isPending ? (
						<DrawerSkeleton />
					) : (
						<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem]">
							<ProudMomentArticle
								highlight={highlight}
								hideNav
							/>
							{(highlight.prev ?? highlight.next) && (
								<ModalPrevNext
									prev={highlight.prev}
									next={highlight.next}
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
	prev: HighlightNavLinkDTO | null;
	next: HighlightNavLinkDTO | null;
	onNavigate: (slug: string) => void;
}

function ModalPrevNext({ prev, next, onNavigate }: ModalPrevNextProps) {
	return (
		<nav
			aria-label="Proud moment navigation"
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

"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { fetchWorkDetail } from "@/app/actions/work";
import { WorkArticle } from "@/app/(work-detail)/work/[slug]/_components/work-article";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import type { WorkItemDetailDTO, WorkNavLinkDTO } from "@/sanity/lib/dal";

interface WorkModalDrawerProps {
	work: WorkItemDetailDTO;
}

export function WorkModalDrawer({ work: initialWork }: WorkModalDrawerProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [work, setWork] = useState(initialWork);
	const [, startTransition] = useTransition();
	const scrollRef = useRef<HTMLDivElement>(null);

	// Animate open on first mount
	useEffect(() => {
		setOpen(true);
	}, []);

	function handleClose() {
		setOpen(false);
		// vaul's exit animation is 500ms
		setTimeout(() => router.push("/work"), 500);
	}

	function navigateTo(slug: string) {
		startTransition(async () => {
			const next = await fetchWorkDetail(slug);
			if (!next) return;
			setWork(next);
			scrollRef.current?.scrollTo({ top: 0 });
			router.replace(`/work/${slug}`);
		});
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

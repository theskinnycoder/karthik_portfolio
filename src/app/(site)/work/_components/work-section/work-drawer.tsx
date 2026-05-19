"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWorkDetail } from "@/app/actions/work";
import { WorkArticle } from "@/app/(work-detail)/work/[slug]/_components/work-article";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { WorkItemDetailDTO, WorkNavLinkDTO } from "@/sanity/lib/dal";

interface WorkDetailDrawerProps {
	slug: string | null;
	onClose: () => void;
	onNavigate: (slug: string) => void;
}

export function WorkDetailDrawer({
	slug,
	onClose,
	onNavigate,
}: WorkDetailDrawerProps) {
	const [fetchedSlug, setFetchedSlug] = useState<string | null>(null);
	const [work, setWork] = useState<WorkItemDetailDTO | null>(null);

	// Derived — true whenever a new slug hasn't resolved yet
	const loading = !!slug && slug !== fetchedSlug;
	// Hide stale content while the next item loads
	const displayWork = loading ? null : work;

	useEffect(() => {
		if (!slug) return;
		fetchWorkDetail(slug).then((data) => {
			setWork(data);
			setFetchedSlug(slug);
		});
	}, [slug]);

	return (
		<Drawer
			open={!!slug}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DrawerContent
				data-theme="work-detail"
				className="mt-0 h-dvh max-h-none p-0 bg-background before:hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-none [&>div:first-child]:hidden"
			>
				<div
					className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground"
				>
					{/* Sticky header — inside scroll container so content scrolls behind the glass */}
					<header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/75 backdrop-blur-md">
						<div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3.5">
							<button
								onClick={onClose}
								className="group inline-flex w-fit items-center gap-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
							>
								<span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-95">
									<ArrowLeft className="size-4" />
								</span>
								Go Back
							</button>
						</div>
					</header>

					{loading && (
						<div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-6 pt-10 pb-24">
							{[120, 80, 160, 80, 200].map((w, i) => (
								<div
									key={i}
									className="h-5 animate-pulse rounded-md bg-foreground/10"
									style={{ width: `${w}%`.replace("200%", "100%"), maxWidth: "100%" }}
								/>
							))}
						</div>
					)}

					{displayWork && (
						<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem] [&_figure]:!mx-0 [&_figure_img]:!rounded-none">
							<WorkArticle
								work={displayWork}
								hideNav
							/>
							{(displayWork.prev ?? displayWork.next) && (
								<DrawerPrevNext
									prev={displayWork.prev}
									next={displayWork.next}
									onNavigate={onNavigate}
								/>
							)}
						</main>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface DrawerPrevNextProps {
	prev: WorkNavLinkDTO | null;
	next: WorkNavLinkDTO | null;
	onNavigate: (slug: string) => void;
}

function DrawerPrevNext({ prev, next, onNavigate }: DrawerPrevNextProps) {
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
					<span className="w-full truncate text-sm leading-snug font-semibold text-[#141414] sm:text-base">
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
					<span className="w-full truncate text-sm leading-snug font-semibold text-[#141414] sm:text-base">
						{next.title}
					</span>
				</button>
			)}
		</nav>
	);
}

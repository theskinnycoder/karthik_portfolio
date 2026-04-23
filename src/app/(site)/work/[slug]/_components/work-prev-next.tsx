import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkNavLinkDTO } from "@/sanity/lib/dal";

interface WorkPrevNextProps {
	prev: WorkNavLinkDTO | null;
	next: WorkNavLinkDTO | null;
}

/**
 * Prev/next case-study navigation rendered at the bottom of the article.
 * Adapts to single-sided when only one neighbor exists.
 */
export function WorkPrevNext({ prev, next }: WorkPrevNextProps) {
	const singleColumn = !prev || !next;

	return (
		<nav
			aria-label="Case study navigation"
			className={cn(
				"grid grid-cols-1 gap-3 border-t border-border pt-8",
				!singleColumn && "sm:grid-cols-2",
			)}
		>
			{prev && (
				<NavCard
					link={prev}
					direction="prev"
				/>
			)}
			{next && (
				<NavCard
					link={next}
					direction="next"
					align={!prev ? "start" : "end"}
				/>
			)}
		</nav>
	);
}

interface NavCardProps {
	link: WorkNavLinkDTO;
	direction: "prev" | "next";
	align?: "start" | "end";
}

function NavCard({ link, direction, align = "start" }: NavCardProps) {
	const isNext = direction === "next";
	return (
		<Link
			href={{ pathname: `/work/${link.slug}` }}
			className={cn(
				"group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[var(--brand-primary,var(--color-muted-foreground))]",
				isNext && align === "end" && "sm:text-right",
			)}
		>
			<span
				className={cn(
					"flex items-center gap-1.5 text-xs font-medium tracking-wide text-card-foreground/60 uppercase",
					isNext && align === "end" && "sm:justify-end",
				)}
			>
				{!isNext && <ArrowLeft className="size-3.5" />}
				{isNext ? "Next" : "Previous"}
				{isNext && <ArrowRight className="size-3.5" />}
			</span>
			<span className="text-base font-semibold text-card-foreground">
				{link.title}
			</span>
			{link.tag && (
				<span
					className={cn(
						"inline-flex w-fit rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-light text-foreground",
						isNext && align === "end" && "sm:self-end",
					)}
				>
					{link.tag}
				</span>
			)}
		</Link>
	);
}

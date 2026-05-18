import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkNavLinkDTO } from "@/sanity/lib/dal";

interface WorkPrevNextProps {
	prev: WorkNavLinkDTO | null;
	next: WorkNavLinkDTO | null;
}

export function WorkPrevNext({ prev, next }: WorkPrevNextProps) {
	const justify =
		prev && next ? "justify-between" : next ? "justify-end" : "justify-start";

	return (
		<>
			{/* Mobile / tablet — inline inside content padding */}
			<nav
				aria-label="Case study navigation"
				className={cn("flex items-center lg:hidden", justify)}
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
					/>
				)}
			</nav>

			{/* Desktop — fixed adjacent to content edges, min 1rem from viewport edge */}
			{prev && (
				<div
					className="fixed bottom-10 z-40 hidden w-[9.5rem] overflow-hidden lg:block"
					style={{ left: "max(1rem, calc(50% - 31.25rem))" }}
				>
					<NavCard
						link={prev}
						direction="prev"
					/>
				</div>
			)}
			{next && (
				<div
					className="fixed bottom-10 z-40 hidden w-[9.5rem] overflow-hidden lg:block"
					style={{ right: "max(1rem, calc(50% - 31.25rem))" }}
				>
					<NavCard
						link={next}
						direction="next"
					/>
				</div>
			)}
		</>
	);
}

interface NavCardProps {
	link: WorkNavLinkDTO;
	direction: "prev" | "next";
}

function NavCard({ link, direction }: NavCardProps) {
	const isNext = direction === "next";
	return (
		<Link
			href={{ pathname: `/work/${link.slug}` }}
			className="flex min-h-16 flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 transition-colors hover:border-[rgba(33,33,33,0.2)]"
		>
			<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
				{!isNext && <ArrowLeft className="size-3" />}
				{isNext ? "Next" : "Previous"}
				{isNext && <ArrowRight className="size-3" />}
			</span>
			<span className="text-base leading-tight font-semibold text-[#141414]">
				{link.title}
			</span>
		</Link>
	);
}

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HighlightNavLinkDTO } from "@/sanity/lib/dal";

interface ProudMomentPrevNextProps {
	prev: HighlightNavLinkDTO | null;
	next: HighlightNavLinkDTO | null;
}

export function ProudMomentPrevNext({ prev, next }: ProudMomentPrevNextProps) {
	return (
		<nav
			aria-label="Proud moment navigation"
			className="-mx-6 grid grid-cols-2 items-stretch gap-3 border-t border-border px-6 pt-4"
		>
			<div className="flex">
				{prev && (
					<NavCard
						link={prev}
						direction="prev"
					/>
				)}
			</div>
			<div className="flex justify-end">
				{next && (
					<NavCard
						link={next}
						direction="next"
					/>
				)}
			</div>
		</nav>
	);
}

interface NavCardProps {
	link: HighlightNavLinkDTO;
	direction: "prev" | "next";
}

function NavCard({ link, direction }: NavCardProps) {
	const isNext = direction === "next";
	return (
		<Link
			href={{ pathname: `/proud-moments/${link.slug}` }}
			className={cn(
				"flex min-h-16 w-full min-w-0 flex-col justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]",
				isNext ? "items-end text-right" : "items-start text-left",
			)}
		>
			<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
				{!isNext && <ArrowLeft className="size-3" />}
				{isNext ? "Next" : "Previous"}
				{isNext && <ArrowRight className="size-3" />}
			</span>
			<span className="w-full truncate text-base leading-snug font-semibold text-[#141414]">
				{link.title}
			</span>
		</Link>
	);
}

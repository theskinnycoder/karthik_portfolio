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
		<nav
			aria-label="Case study navigation"
			className={cn("flex items-center", justify)}
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
			className="flex h-16 flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(33,33,33,0.1)] bg-muted px-4 py-3 whitespace-nowrap transition-colors hover:border-[rgba(33,33,33,0.2)]"
		>
			<span className="flex items-center gap-1 text-xs leading-none font-normal text-[#808080]">
				{!isNext && <ArrowLeft className="size-3" />}
				{isNext ? "Next" : "Previous"}
				{isNext && <ArrowRight className="size-3" />}
			</span>
			<span className="text-base leading-none font-semibold text-[#141414]">
				{link.title}
			</span>
		</Link>
	);
}

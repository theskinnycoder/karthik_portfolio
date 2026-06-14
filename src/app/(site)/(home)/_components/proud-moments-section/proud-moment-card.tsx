"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MediaImage } from "@/components/media";
import { formatMonthYear } from "@/lib/format-date";
import { setProudMomentDrawerSignal } from "@/lib/proud-moment-drawer-signal";
import { cn } from "@/lib/utils";
import type { HighlightDTO } from "@/sanity/lib/dal";

interface ProudMomentCardProps {
	item: HighlightDTO;
	/** Eager-load this card's image (set on the first card to improve LCP). */
	priority?: boolean;
}

export function ProudMomentCard({
	item,
	priority = false,
}: ProudMomentCardProps) {
	const pathname = usePathname();
	const isDrawerOpen = pathname === `/proud-moments/${item.slug}`;

	const row = (
		<div className="flex h-full flex-col gap-4">
			{/* Image on top */}
			<div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
				<MediaImage
					src={item.image}
					alt={item.title}
					fill
					loading={priority ? "eager" : undefined}
					fetchPriority={priority ? "high" : undefined}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30rem"
					className="object-cover object-center"
				/>
			</div>

			{/* Body below */}
			<div className="flex min-w-0 flex-col gap-2">
				{item.date && (
					<span className="w-fit rounded-full border border-border bg-card px-2.5 py-1 text-xs font-light tracking-prose whitespace-nowrap text-muted-foreground">
						{formatMonthYear(item.date)}
					</span>
				)}
				<h3 className="text-[2rem] leading-snug font-semibold tracking-tight text-foreground">
					{item.title}
				</h3>
				<p className="line-clamp-2 text-lg leading-relaxed font-light tracking-prose text-muted-foreground">
					{item.description}
				</p>
			</div>
		</div>
	);

	if (isDrawerOpen) {
		return <div className="block h-full w-full text-left">{row}</div>;
	}

	return (
		<Link
			href={`/proud-moments/${item.slug}`}
			className={cn(
				"group block h-full w-full text-left transition-opacity hover:opacity-90",
			)}
			onClick={setProudMomentDrawerSignal}
		>
			{row}
		</Link>
	);
}

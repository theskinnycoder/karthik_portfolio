"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MediaImage } from "@/components/media";
import { cn } from "@/lib/utils";
import { setWorkDrawerSignal } from "@/lib/work-drawer-signal";
import type { WorkItemDTO } from "@/sanity/lib/dal";

interface WorkItemCardProps {
	item: WorkItemDTO;
	/** Flip the row (image right / text left) for the alternating zig-zag layout. */
	reverse?: boolean;
	/** Eager-load + preload this card's image (set on the first card to improve LCP). */
	priority?: boolean;
}

export function WorkItemCard({
	item,
	reverse = false,
	priority = false,
}: WorkItemCardProps) {
	const pathname = usePathname();
	const isDrawerOpen = pathname === `/work/${item.slug}`;

	const card = (
		<motion.div
			className={cn(
				"flex flex-col gap-6 md:items-center md:gap-12",
				reverse ? "md:flex-row-reverse" : "md:flex-row",
			)}
			whileHover={isDrawerOpen ? undefined : { scale: 0.98 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			{/* Image */}
			<div
				className="relative -mx-6 w-[calc(100%+3rem)] shrink-0 overflow-hidden border-0 md:mx-0 md:w-1/2 md:rounded-2xl md:border md:border-border"
				style={{ aspectRatio: "var(--card-image-ratio, 1 / 1)" }}
			>
				<MediaImage
					src={item.image}
					alt={item.title}
					fill
					loading={priority ? "eager" : undefined}
					fetchPriority={priority ? "high" : undefined}
					className="object-cover object-center"
				/>
			</div>

			{/* Text column */}
			<div className="flex w-full flex-col gap-4 md:w-1/2">
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-light tracking-prose whitespace-nowrap text-foreground">
						{item.tag}
					</span>
				</div>

				<h3 className="text-4xl leading-[1.1] font-semibold tracking-tight text-foreground md:text-[3.125rem] lg:text-[3.5rem]">
					{item.title}
				</h3>

				<p className="text-base leading-relaxed font-light tracking-prose text-muted-foreground md:text-lg">
					{item.description}
				</p>
			</div>
		</motion.div>
	);

	if (isDrawerOpen) {
		return <div className="block w-full text-left">{card}</div>;
	}

	return (
		<Link
			href={`/work/${item.slug}`}
			className="block w-full text-left"
			onClick={setWorkDrawerSignal}
		>
			{card}
		</Link>
	);
}

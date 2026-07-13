"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { MediaImage } from "@/components/media";
import useIsMobile from "@/hooks/use-media-query";
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
	const isMobile = useIsMobile();

	const imageRef = React.useRef<HTMLDivElement>(null);
	const textColRef = React.useRef<HTMLDivElement>(null);
	const descriptionRef = React.useRef<HTMLParagraphElement>(null);

	React.useLayoutEffect(() => {
		const imageEl = imageRef.current;
		const textColEl = textColRef.current;
		const descriptionEl = descriptionRef.current;
		if (!imageEl || !textColEl || !descriptionEl) return;

		// measure() is the sole source of truth for the description's clamp
		// style — it always applies the final result itself rather than
		// relying on a React re-render, since ResizeObserver's automatic
		// initial callback can recompute the same clamp value it already
		// applied, and React skips re-rendering (and re-committing the
		// style) when a state update doesn't change the value.
		const measure = () => {
			// Reset to natural (unclamped) height before measuring.
			descriptionEl.style.display = "";
			descriptionEl.style.webkitLineClamp = "";
			descriptionEl.style.webkitBoxOrient = "";
			descriptionEl.style.overflow = "";

			if (isMobile) return;

			const imageHeight = imageEl.offsetHeight;
			const naturalTextHeight = textColEl.scrollHeight;
			if (naturalTextHeight <= imageHeight) return;

			const lineHeight =
				Number.parseFloat(getComputedStyle(descriptionEl).lineHeight) || 24;
			const descriptionLines = Math.round(
				descriptionEl.scrollHeight / lineHeight,
			);
			const excess = naturalTextHeight - imageHeight;
			const linesToRemove = Math.ceil(excess / lineHeight);
			const clampLines = Math.max(1, descriptionLines - linesToRemove);

			descriptionEl.style.display = "-webkit-box";
			descriptionEl.style.webkitLineClamp = String(clampLines);
			descriptionEl.style.webkitBoxOrient = "vertical";
			descriptionEl.style.overflow = "hidden";
		};

		measure();

		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(imageEl);
		return () => resizeObserver.disconnect();
	}, [isMobile, item.description, item.title]);

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
				ref={imageRef}
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
			<div
				ref={textColRef}
				className="flex w-full flex-col gap-4 md:w-1/2"
			>
				<div className="flex items-center gap-2">
					<span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-light tracking-prose whitespace-nowrap text-foreground">
						{item.tag}
					</span>
				</div>

				<h3 className="text-4xl leading-[1.1] font-semibold tracking-tight text-foreground md:text-4xl lg:text-[3.375rem]">
					{item.title}
				</h3>

				<p
					ref={descriptionRef}
					className="text-base leading-relaxed font-light tracking-prose text-muted-foreground md:text-lg"
				>
					{item.description}
				</p>

				{item.client && (
					<div className="flex flex-col items-start gap-1.5">
						<span className="text-xs tracking-wide text-muted-foreground uppercase">
							Client
						</span>
						<MediaImage
							src={item.client.logo}
							alt={`${item.client.name} logo`}
							width={0}
							height={0}
							className="h-[22px] w-auto object-contain"
							sizes="120px"
						/>
					</div>
				)}
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

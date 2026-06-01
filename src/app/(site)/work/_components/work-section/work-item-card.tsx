"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MediaImage } from "@/components/media";
import type { WorkItemDTO } from "@/sanity/lib/dal";

interface WorkItemCardProps {
	item: WorkItemDTO;
}

const DEFAULT_BRAND_FROM = "#c8ed97";
const DEFAULT_BRAND_TO = "#47d9b8";

export function WorkItemCard({ item }: WorkItemCardProps) {
	const from = item.brandFrom ?? DEFAULT_BRAND_FROM;
	const to = item.brandTo ?? item.brandFrom ?? DEFAULT_BRAND_TO;
	const ctaStyle = {
		"--brand-from": from,
		"--brand-to": to,
		...(item.brandIcon ? { "--brand-icon": item.brandIcon } : {}),
	} as CSSProperties;

	return (
		<Link
			href={`/work/${item.slug}`}
			className="block h-full w-full text-left"
		>
			<motion.div
				className="flex h-full flex-col gap-3 rounded-[20px] border border-border bg-card p-3.5"
				whileHover={{ scale: 0.98 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				<div className="flex items-center gap-1.5">
					{item.icon && (
						<MediaImage
							src={item.icon}
							alt=""
							width={16}
							height={16}
							className="size-4"
						/>
					)}
					<span className="min-w-0 truncate text-sm leading-prose font-medium tracking-prose text-foreground">
						{item.title}
					</span>
					<span className="ml-auto shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-light tracking-prose whitespace-nowrap text-foreground">
						{item.tag}
					</span>
				</div>
				<div
					className="relative overflow-hidden rounded-xl"
					style={{ aspectRatio: "var(--card-image-ratio, 11/10)" }}
				>
					<MediaImage
						src={item.image}
						alt={item.title}
						fill
						className="object-cover object-center"
					/>
				</div>
				<div className="mt-auto flex items-center gap-2">
					<p className="flex-1 truncate text-sm leading-prose font-light tracking-prose text-muted-foreground">
						{item.description}
					</p>
					<div
						style={ctaStyle}
						className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)]"
					>
						<ArrowUpRight
							className="size-4"
							style={{ color: "var(--brand-icon, var(--background))" }}
						/>
					</div>
				</div>
			</motion.div>
		</Link>
	);
}

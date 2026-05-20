"use client";

import type { MediumPostDTO } from "@/lib/medium";
import { motion } from "motion/react";

interface BlogCardProps {
	post: MediumPostDTO;
}

function MediumIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}
		>
			<path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
		</svg>
	);
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function BlogCard({ post }: BlogCardProps) {
	return (
		<a
			href={post.link}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-full"
			aria-label={`Read "${post.title}" on Medium`}
		>
			<motion.div
				className="flex h-full flex-col overflow-hidden rounded-[18px] border border-border bg-card"
				whileHover={{ scale: 0.98 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				{/* Cover image */}
				{post.thumbnail ? (
					<div className="aspect-[16/9] w-full overflow-hidden">
						<img
							src={post.thumbnail}
							alt=""
							loading="lazy"
							className="h-full w-full object-cover"
						/>
					</div>
				) : (
					<div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary">
						<MediumIcon className="size-10 text-muted-foreground/40" />
					</div>
				)}

				{/* Body */}
				<div className="flex flex-1 flex-col gap-2 p-4">
					<h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
						{post.title}
					</h3>
					<p className="line-clamp-3 flex-1 text-sm font-light text-muted-foreground">
						{post.excerpt}
					</p>

					{/* Footer row */}
					<div className="mt-1 flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							{formatDate(post.pubDate)}
						</span>
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<MediumIcon className="size-3" />
							<span>Read on Medium</span>
						</div>
					</div>
				</div>
			</motion.div>
		</a>
	);
}

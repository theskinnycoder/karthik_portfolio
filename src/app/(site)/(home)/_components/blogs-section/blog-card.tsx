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
		<motion.a
			href={post.link}
			target="_blank"
			rel="noopener noreferrer"
			className="flex h-full flex-col border-y border-border"
			aria-label={`Read "${post.title}" on Medium`}
			whileHover={{ scale: 0.98 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			<div className="flex flex-col gap-3 py-5 pr-5 pl-5 md:pr-7 md:pl-7">
				{/* Text + thumbnail */}
				<div className="flex items-start gap-4">
					<div className="flex flex-1 flex-col gap-2">
						<p className="text-xs text-muted-foreground">
							{formatDate(post.pubDate)}
						</p>
						<h3 className="line-clamp-3 text-base leading-snug font-bold text-foreground">
							{post.title}
						</h3>
						<p className="line-clamp-2 text-sm font-light text-muted-foreground">
							{post.excerpt}
						</p>
					</div>
					{post.thumbnail && (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={post.thumbnail}
							alt=""
							loading="lazy"
							className="aspect-[3/2] w-28 shrink-0 rounded object-cover"
						/>
					)}
				</div>

				{/* Read on Medium */}
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<MediumIcon className="size-3" />
					<span>Read on Medium</span>
				</div>
			</div>
		</motion.a>
	);
}

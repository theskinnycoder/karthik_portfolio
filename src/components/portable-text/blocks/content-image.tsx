"use client";

import { MediaImage } from "@/components/media";
import { cn } from "@/lib/utils";
import type { ContentImageDTO } from "@/sanity/lib/dal";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ContentImageProps {
	value: ContentImageDTO;
}

export function ContentImage({ value }: ContentImageProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	// Prevent body scroll while lightbox is open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	if (!value.url) return null;
	const dimensions = sizeToDimensions(value.size);

	return (
		<>
			<figure
				className={cn(
					"my-8 cursor-zoom-in",
					value.size === "wide" && "md:-mx-16 lg:-mx-24",
					value.size === "full" && "-mx-6",
				)}
				onClick={() => setOpen(true)}
			>
				<MediaImage
					src={value.url}
					alt={value.alt}
					width={dimensions.width}
					height={dimensions.height}
					className={cn(
						"w-full object-cover",
						value.size === "full" ? "rounded-none" : "rounded-lg",
					)}
				/>
				{value.caption && (
					<figcaption className="mt-2 text-center text-xs font-light text-muted-foreground">
						{value.caption}
					</figcaption>
				)}
			</figure>

			{open &&
				createPortal(
					<div
						role="dialog"
						aria-modal="true"
						aria-label={value.alt || "Full-size image"}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
						onClick={() => setOpen(false)}
					>
						{/* Close button */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setOpen(false);
							}}
							aria-label="Close image"
							className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
						>
							<X className="h-5 w-5" />
						</button>

						{/* Image — stop propagation so clicking the image itself doesn't close */}
						<img
							src={value.url}
							alt={value.alt}
							className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						/>
					</div>,
					document.body,
				)}
		</>
	);
}

function sizeToDimensions(size: ContentImageDTO["size"]) {
	switch (size) {
		case "full":
			return { width: 1600, height: 900 };
		case "wide":
			return { width: 1400, height: 787 };
		case "inline":
		default:
			return { width: 1200, height: 675 };
	}
}

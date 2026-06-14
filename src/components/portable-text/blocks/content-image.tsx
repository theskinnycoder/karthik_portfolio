"use client";

import { MediaImage } from "@/components/media";
import { cn } from "@/lib/utils";
import type { ContentImageDTO } from "@/sanity/lib/dal";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ContentImageProps {
	value: ContentImageDTO;
	/** Eager-load + preload this image (set on the first/hero image to improve LCP). */
	priority?: boolean;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;

function pinchDist(touches: TouchList) {
	return Math.hypot(
		touches[0].clientX - touches[1].clientX,
		touches[0].clientY - touches[1].clientY,
	);
}
function pinchMid(touches: TouchList) {
	return {
		x: (touches[0].clientX + touches[1].clientX) / 2,
		y: (touches[0].clientY + touches[1].clientY) / 2,
	};
}

export function ContentImage({ value, priority = false }: ContentImageProps) {
	const [open, setOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const overlayRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	// Live transform state — kept in refs so event handlers never go stale
	const scaleRef = useRef(1);
	const offsetRef = useRef({ x: 0, y: 0 });
	const pinchDistRef = useRef<number | null>(null);
	const dragStart = useRef<{
		x: number;
		y: number;
		ox: number;
		oy: number;
	} | null>(null);

	/** Apply transform directly to DOM — avoids React re-render on every wheel tick */
	function applyTransform(s: number, ox: number, oy: number, animate = false) {
		const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
		const finalOx = clamped <= 1 ? 0 : ox;
		const finalOy = clamped <= 1 ? 0 : oy;
		scaleRef.current = clamped;
		offsetRef.current = { x: finalOx, y: finalOy };
		if (imgRef.current) {
			imgRef.current.style.transition = animate
				? "transform 0.2s ease-out"
				: "none";
			imgRef.current.style.transform = `translate(${finalOx}px, ${finalOy}px) scale(${clamped})`;
		}
	}

	function resetZoom(animate = false) {
		applyTransform(1, 0, 0, animate);
	}

	/** Zoom by `factor` keeping screen point (cx, cy) pinned under cursor/finger */
	function zoomAt(factor: number, cx: number, cy: number) {
		const overlay = overlayRef.current;
		if (!overlay) return;
		const rect = overlay.getBoundingClientRect();
		// Position relative to overlay center (where image is centered)
		const px = cx - rect.left - rect.width / 2;
		const py = cy - rect.top - rect.height / 2;

		const oldScale = scaleRef.current;
		const newScale = Math.min(
			MAX_SCALE,
			Math.max(MIN_SCALE, oldScale * factor),
		);
		const ratio = newScale / oldScale;

		const newOx = newScale <= 1 ? 0 : offsetRef.current.x + px * (1 - ratio);
		const newOy = newScale <= 1 ? 0 : offsetRef.current.y + py * (1 - ratio);

		applyTransform(newScale, newOx, newOy);
	}

	// ESC — capture phase beats Vaul's bubble-phase drawer handler
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.stopImmediatePropagation();
				setOpen(false);
			}
		};
		window.addEventListener("keydown", onKey, { capture: true });
		return () =>
			window.removeEventListener("keydown", onKey, { capture: true });
	}, [open]);

	// Reset zoom when lightbox closes
	useEffect(() => {
		if (!open) resetZoom();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	// Body scroll lock
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Wheel + touch + mouse drag — all wired to the overlay element
	useEffect(() => {
		if (!open) return;
		const overlay = overlayRef.current;
		if (!overlay) return;

		// ── Mouse wheel ────────────────────────────────────────────────────
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			zoomAt(e.deltaY < 0 ? 1.1 : 0.9, e.clientX, e.clientY);
		};

		// ── Touch (pinch zoom + single-finger pan) ─────────────────────────
		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				pinchDistRef.current = pinchDist(e.touches);
				dragStart.current = null;
			} else if (e.touches.length === 1 && scaleRef.current > 1) {
				dragStart.current = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
					ox: offsetRef.current.x,
					oy: offsetRef.current.y,
				};
			}
		};

		const onTouchMove = (e: TouchEvent) => {
			if (e.touches.length === 2 && pinchDistRef.current !== null) {
				e.preventDefault();
				const dist = pinchDist(e.touches);
				const mid = pinchMid(e.touches);
				zoomAt(dist / pinchDistRef.current, mid.x, mid.y);
				pinchDistRef.current = dist;
			} else if (
				e.touches.length === 1 &&
				dragStart.current &&
				scaleRef.current > 1
			) {
				e.preventDefault();
				const dx = e.touches[0].clientX - dragStart.current.x;
				const dy = e.touches[0].clientY - dragStart.current.y;
				applyTransform(
					scaleRef.current,
					dragStart.current.ox + dx,
					dragStart.current.oy + dy,
				);
			}
		};

		const onTouchEnd = () => {
			pinchDistRef.current = null;
			dragStart.current = null;
			// Snap back if nearly at 1× (avoids awkward sub-1 states)
			if (scaleRef.current < 1.05) resetZoom(true);
		};

		// ── Mouse drag (desktop pan when zoomed in) ────────────────────────
		const onMouseDown = (e: MouseEvent) => {
			if (scaleRef.current <= 1) return;
			if ((e.target as HTMLElement).closest('[aria-label="Close image"]'))
				return;
			e.preventDefault();
			dragStart.current = {
				x: e.clientX,
				y: e.clientY,
				ox: offsetRef.current.x,
				oy: offsetRef.current.y,
			};
			setIsDragging(true);
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!dragStart.current) return;
			const dx = e.clientX - dragStart.current.x;
			const dy = e.clientY - dragStart.current.y;
			applyTransform(
				scaleRef.current,
				dragStart.current.ox + dx,
				dragStart.current.oy + dy,
			);
		};

		const onMouseUp = () => {
			dragStart.current = null;
			setIsDragging(false);
		};

		overlay.addEventListener("wheel", onWheel, { passive: false });
		overlay.addEventListener("touchstart", onTouchStart, { passive: true });
		overlay.addEventListener("touchmove", onTouchMove, { passive: false });
		overlay.addEventListener("touchend", onTouchEnd);
		overlay.addEventListener("touchcancel", onTouchEnd);
		overlay.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);

		return () => {
			overlay.removeEventListener("wheel", onWheel);
			overlay.removeEventListener("touchstart", onTouchStart);
			overlay.removeEventListener("touchmove", onTouchMove);
			overlay.removeEventListener("touchend", onTouchEnd);
			overlay.removeEventListener("touchcancel", onTouchEnd);
			overlay.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	if (!value.url) return null;
	const dimensions = sizeToDimensions(value.size);

	return (
		<>
			<figure
				className={cn(
					"my-8 cursor-zoom-in",
					value.size === "wide" && "md:-mx-16 lg:-mx-24",
					value.size === "full" && "ml-[calc(50%_-_50vw)] w-screen px-6 md:px-[2.5rem]",
				)}
				onClick={() => setOpen(true)}
			>
				<MediaImage
					src={value.url}
					alt={value.alt}
					width={dimensions.width}
					height={dimensions.height}
					loading={priority ? "eager" : undefined}
					fetchPriority={priority ? "high" : undefined}
					className={cn("h-auto w-full rounded-none object-cover")}
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
						ref={overlayRef}
						role="dialog"
						aria-modal="true"
						aria-label={value.alt || "Full-size image"}
						className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-sm"
						style={{
							cursor: isDragging
								? "grabbing"
								: scaleRef.current > 1
									? "grab"
									: "default",
						}}
						onClick={(e) => {
							if (e.target === e.currentTarget) setOpen(false);
						}}
					>
						{/* Close button */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setOpen(false);
							}}
							aria-label="Close image"
							className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
						>
							<X className="h-5 w-5" />
						</button>

						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							ref={imgRef}
							src={value.url}
							alt={value.alt}
							className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl select-none"
							style={{
								transformOrigin: "center center",
								willChange: "transform",
							}}
							draggable={false}
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

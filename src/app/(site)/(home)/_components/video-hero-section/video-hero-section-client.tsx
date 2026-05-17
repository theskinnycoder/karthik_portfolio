"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export function VideoHeroSectionClient({
	availabilityMessage,
}: {
	availabilityMessage: string;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	function togglePlay() {
		if (!videoRef.current) return;

		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
		setIsPlaying(!isPlaying);
	}

	// Caption rendered in two places: mobile (section-level, self-centered) and
	// md+ (inside inner div, original flow). CSS show/hide keeps only one visible.
	function Caption({ className }: { className?: string }) {
		const splitWord = " but ";
		const idx = availabilityMessage.toLowerCase().indexOf(splitWord);
		const content =
			idx === -1 ? (
				`(${availabilityMessage})`
			) : (
				<>
					({availabilityMessage.slice(0, idx + 4)}
					<br />
					{availabilityMessage.slice(idx + 5)})
				</>
			);
		return (
			<p
				className={`mt-4 text-center font-serif text-base font-semibold text-[#cccccc] md:text-xl${className ? ` ${className}` : ""}`}
			>
				{content}
			</p>
		);
	}

	return (
		<section className="flex flex-col items-end md:items-center xl:items-end">
			<div className="flex flex-col items-center md:translate-x-[7.8125rem] xl:translate-x-0">
				<div className="relative">
					{/*
					 * "Let me introduce myself" — rotated, left of the circle
					 *
					 * Responsive tiers:
					 *   < 375px    circle 12.5rem  + ml-10(2.5rem)  = 15rem    →  text -left-6
					 *   375–639px  circle 13.75rem + ml-16(4rem)    = 17.75rem →  text -left-8
					 *   640–767px  circle 16.875rem + ml-16(4rem)   = 20.875rem→  text -left-12
					 *   768px+     circle 22.5rem  + ml-0           = 22.5rem  →  text -left-[6.875rem]
					 *   (1280px+   switches to 2-col grid via site-page.tsx)
					 */}
					<p className="absolute top-32 -left-6 -rotate-16 font-serif text-xl leading-tight font-semibold text-[#cccccc] min-[375px]:top-36 min-[375px]:-left-8 sm:top-52 sm:-left-12 sm:text-2xl md:top-[16.25rem] md:-left-[6.875rem] md:text-3xl">
						Let me
						<br />
						introduce
						<br />
						myself
					</p>

					{/* Main circle area */}
					<div className="relative ml-10 min-[375px]:ml-16 md:ml-0">
						{/* circle.gif — animated ring overlay */}
						<div className="relative size-[12.5rem] min-[375px]:size-[13.75rem] sm:size-[16.875rem] md:size-[22.5rem]">
							<Image
								src="/circle.gif"
								alt=""
								fill
								className="pointer-events-none absolute inset-0 z-10 size-full object-cover"
								unoptimized
							/>
						</div>

						{/* Circular video — positioned inside the ring */}
						<div className="absolute inset-0 z-0 flex items-center justify-center">
							<div className="relative size-[10.3125rem] translate-x-1 overflow-hidden rounded-full min-[375px]:size-[11.25rem] sm:size-56 md:size-[19.1875rem]">
								<video
									ref={videoRef}
									muted
									loop
									playsInline
									className="absolute inset-0 size-full object-cover"
									onEnded={() => setIsPlaying(false)}
								>
									<source
										src="/Intro.mov"
										type="video/mp4"
									/>
								</video>
							</div>
						</div>

						{/* Indicator.gif — pointing at the circle */}
						<Image
							src="/Indicator.gif"
							alt=""
							width={155}
							height={155}
							className="pointer-events-none absolute -bottom-4 -left-8 z-10 size-[6.25rem] min-[375px]:size-[7.5rem] sm:size-[9.6875rem] md:size-[11.5625rem]"
							unoptimized
						/>

						{/* Play/Pause button */}
						<button
							type="button"
							onClick={togglePlay}
							className="absolute bottom-0 left-1/2 z-20 flex size-18 -translate-x-1/2 translate-y-3 cursor-pointer items-center justify-center rounded-full bg-white/15 shadow-lg backdrop-blur-[15px]"
							aria-label={isPlaying ? "Pause video" : "Play video"}
						>
							{isPlaying ? (
								<Pause className="size-8 fill-white text-white" />
							) : (
								<Play className="size-8 fill-white text-white" />
							)}
						</button>
					</div>
				</div>

				{/* tablet+ — inside the inner div so it inherits the translate and items-center */}
				<Caption className="hidden md:block" />
			</div>

			{/* mobile only — at section level with self-center to escape items-end */}
			<Caption className="self-center md:hidden" />
		</section>
	);
}

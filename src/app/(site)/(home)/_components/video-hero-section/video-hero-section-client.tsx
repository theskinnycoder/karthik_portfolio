"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

// ml + w match the "Main circle area" div at every breakpoint so that
// text-center lands under the circle, not the inner div's midpoint.
function Caption({ message }: { message: string }) {
	const splitWord = " but ";
	const idx = message.toLowerCase().indexOf(splitWord);
	const content =
		idx === -1 ? (
			`(${message})`
		) : (
			<>
				({message.slice(0, idx + 4)}
				<br className="hidden min-[375px]:block" />
				{message.slice(idx + 4)})
			</>
		);
	return (
		<p className="mt-4 ml-10 w-[13.125rem] text-center font-serif text-[1.125rem] leading-[1.1875rem] font-bold text-muted-foreground min-[375px]:ml-16 min-[375px]:w-[15.9375rem] min-[425px]:w-[17.8125rem] sm:w-[16.875rem] md:ml-0 md:w-[22.5rem] md:text-xl">
			{content}
		</p>
	);
}

export function VideoHeroSectionClient({
	availabilityMessage,
	heroVideoUrl,
	heroPosterUrl,
}: {
	availabilityMessage: string;
	heroVideoUrl: string;
	heroPosterUrl: string;
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

	function handleEnded() {
		if (!videoRef.current) return;
		videoRef.current.load();
		setIsPlaying(false);
	}

	return (
		<section className="-mx-2 flex flex-col items-end md:mx-0 md:items-center xl:items-end">
			<div className="flex flex-col items-center md:translate-x-[7.8125rem] xl:translate-x-0">
				<div className="relative">
					{/*
					 * "Let me introduce myself" — rotated, left of the circle
					 *
					 * Responsive tiers:
					 *   < 375px    circle 11.25rem  + ml-10(2.5rem)  = 13.75rem  →  text -left-6
					 *   375–424px  circle 13.125rem + ml-16(4rem)    = 17.125rem →  text -left-8
					 *   425–639px  circle 14.375rem + ml-16(4rem)    = 18.375rem →  text -left-8
					 *   640–767px  circle 16.875rem + ml-16(4rem)    = 20.875rem →  text -left-12
					 *   768px+     circle 22.5rem  + ml-0           = 22.5rem  →  text -left-[6.875rem]
					 *   (1280px+   switches to 2-col grid via site-page.tsx)
					 */}
					<p className="absolute top-32 -left-6 -rotate-16 font-serif text-xl leading-tight font-semibold text-muted-foreground min-[375px]:top-[10.375rem] min-[375px]:-left-[0.875rem] min-[375px]:-rotate-[22deg] min-[375px]:text-2xl sm:top-52 sm:-left-12 sm:text-2xl md:top-[16.25rem] md:-left-[6.875rem] md:text-3xl">
						Let me
						<br />
						introduce
						<br />
						myself
					</p>

					{/* Main circle area */}
					<div className="relative ml-10 min-[375px]:ml-16 md:ml-0">
						{/* circle.gif — animated ring overlay */}
						<div className="relative size-[13.125rem] min-[375px]:size-[15.9375rem] min-[425px]:size-[17.8125rem] sm:size-[16.875rem] md:size-[22.5rem]">
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
							<div className="relative size-[11.25rem] translate-x-1 overflow-hidden rounded-full min-[375px]:size-[13.75rem] min-[425px]:size-[15.625rem] sm:size-56 md:size-[19.1875rem]">
								<video
									ref={videoRef}
									muted
									playsInline
									poster={heroPosterUrl || undefined}
									className="absolute inset-0 size-full object-cover"
									onEnded={handleEnded}
								>
									<source
										src={heroVideoUrl || "/Intro.mov"}
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

				<Caption message={availabilityMessage} />
			</div>
		</section>
	);
}

"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export function VideoHeroSection() {
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

	return (
		<section className="flex flex-col items-end md:items-center">
			<div className="relative">
				{/* "Let me introduce myself" text — rotated, left side */}
				<p className="absolute top-44 -left-12 -rotate-16 font-serif text-xl leading-tight font-light text-[#cccccc] max-md:pl-6 md:text-2xl">
					Let me
					<br />
					introduce
					<br />
					myself
				</p>

				{/* Main circle area */}
				<div className="relative ml-16">
					{/* circle.gif — animated ring overlay */}
					<div className="relative size-64 md:size-73">
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
						<div className="relative size-56 translate-x-1 overflow-hidden rounded-full md:size-64">
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

					{/* arrow.gif — pointing at the circle */}
					<Image
						src="/Indicator.gif"
						alt=""
						width={135}
						height={135}
						className="pointer-events-none absolute -bottom-4 -left-8 z-10"
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

			{/* Disclaimer text */}
			<p className="mt-4 max-w-50 text-center font-serif text-base font-semibold text-balance text-[#cccccc] md:-mr-16 md:text-xl">
				(I am no longer looking for a job but keeping this video up)
			</p>
		</section>
	);
}

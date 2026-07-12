"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import useIsMobile from "@/hooks/use-media-query";
import { SmoothRelease } from "@/lib/embla-smooth-release";
import type { ProjectDTO } from "@/sanity/lib/dal";
import { ProductCard } from "./product-card";

interface OtherWorksCarouselProps {
	projects: ProjectDTO[];
}

export function OtherWorksCarousel({ projects }: OtherWorksCarouselProps) {
	const isMobile = useIsMobile();

	const plugin = React.useRef(
		AutoScroll({
			speed: 1,
			// Grace period before autoplay (re)starts — applies on page load AND after
			// the user releases a manual drag. Without this, autoscroll snapped back
			// instantly on release and fought the user's free-hand scroll.
			startDelay: 1500,
			direction: "backward",
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			active: false,
			breakpoints: {
				"(min-width: 768px)": { active: true },
			},
		}),
	);
	const wheelGestures = React.useRef(WheelGesturesPlugin({ forceWheelAxis: "x" }));
	const smoothRelease = React.useRef(SmoothRelease());

	// Duplicate items only on desktop for seamless looping; mobile uses originals
	const duplicatedProjects = Array.from({ length: 6 }, () => projects).flat();
	const displayedProjects = isMobile ? projects : duplicatedProjects;

	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				dir={isMobile ? "ltr" : "rtl"}
				opts={{
					align: "start",
					direction: "rtl",
					loop: true,
					dragFree: true,
					breakpoints: {
						// Mobile has no autoscroll, so direction only affects manual swipe.
						// LTR here matches the universal "swipe left for next" convention —
						// RTL's align:start would otherwise anchor card 1 to the right edge,
						// requiring a swipe right to reveal card 2 (feels backwards).
						"(max-width: 767px)": { loop: false, direction: "ltr" },
					},
				}}
				plugins={[plugin.current, wheelGestures.current, smoothRelease.current]}
				className="w-full"
			>
				{/* ps-4 (mobile only): insets the leading card 16px from the edge at
				    the resting position — the "start" edge, which is the left edge on
				    mobile (LTR) and the right edge on desktop (RTL). Lives inside the
				    scrollable container, so scrolling is unaffected — desktop stays
				    full-bleed. */}
				<CarouselContent className="items-stretch ps-4 md:ps-0">
					{displayedProjects.map((project, index) => (
						<CarouselItem
							key={`${project.name}-${index}`}
							className="basis-auto"
						>
							<ProductCard
								image={project.image}
								name={project.name}
								description={project.description}
								navigateUrl={project.url}
								backgroundColor={project.backgroundColor}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<ProgressiveBlur
				direction="left"
				blurLayers={4}
				blurIntensity={0.5}
				className="absolute inset-y-0 left-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8 bg-gradient-to-r from-background to-transparent md:block" />
			<ProgressiveBlur
				direction="right"
				blurLayers={4}
				blurIntensity={0.5}
				className="absolute inset-y-0 right-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-gradient-to-l from-background to-transparent md:block" />
		</div>
	);
}

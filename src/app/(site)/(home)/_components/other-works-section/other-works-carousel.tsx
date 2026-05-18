"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import useIsMobile from "@/hooks/use-media-query";
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
			startDelay: 0,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			active: false,
			breakpoints: {
				"(min-width: 768px)": { active: true },
			},
		}),
	);

	// Duplicate items only on desktop for seamless looping; mobile uses originals
	const duplicatedProjects = Array.from({ length: 6 }, () => projects).flat();
	const displayedProjects = isMobile ? projects : duplicatedProjects;

	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				dir="rtl"
				opts={{
					align: "start",
					direction: "rtl",
					loop: true,
					dragFree: true,
					breakpoints: {
						"(max-width: 767px)": { loop: false },
					},
				}}
				plugins={[plugin.current]}
				className="w-full"
			>
				<CarouselContent className="items-stretch">
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
				blurLayers={8}
				blurIntensity={0.5}
				className="absolute inset-y-0 left-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8 bg-gradient-to-r from-background to-transparent md:block" />
			<ProgressiveBlur
				direction="right"
				blurLayers={8}
				blurIntensity={0.5}
				className="absolute inset-y-0 right-0 z-10 hidden w-24 md:block"
			/>
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-gradient-to-l from-background to-transparent md:block" />
		</div>
	);
}

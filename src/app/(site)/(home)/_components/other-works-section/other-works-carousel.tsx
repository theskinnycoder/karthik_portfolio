"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { ProjectDTO } from "@/sanity/lib/dal";
import { ProductCard } from "./product-card";

interface OtherWorksCarouselProps {
	projects: ProjectDTO[];
}

export function OtherWorksCarousel({ projects }: OtherWorksCarouselProps) {
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

	// Duplicate items to ensure enough slides for seamless looping
	const duplicatedProjects = Array.from({ length: 6 }, () => projects).flat();

	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-11 md:w-[calc(100%+5.5rem)]">
			<Carousel
				dir="rtl"
				opts={{
					align: "start",
					direction: "rtl",
					loop: true,
					breakpoints: {
						"(min-width: 768px)": { dragFree: true },
					},
				}}
				plugins={[plugin.current]}
				className="w-full"
			>
				<CarouselContent className="items-stretch">
					{duplicatedProjects.map((project, index) => (
						<CarouselItem
							key={`${project.name}-${index}`}
							className="basis-[85%] md:basis-1/4 lg:basis-[40%]"
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
			<ProgressiveBlur
				direction="right"
				blurLayers={8}
				blurIntensity={0.5}
				className="absolute inset-y-0 right-0 z-10 hidden w-24 md:block"
			/>
		</div>
	);
}

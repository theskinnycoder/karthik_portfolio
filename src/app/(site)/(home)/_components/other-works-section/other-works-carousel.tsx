"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
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
		<div className="w-full self-center md:w-screen md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
							className="basis-[85%] md:basis-1/4 lg:basis-1/5"
						>
							<ProductCard
								image={project.image}
								name={project.name}
								alt={project.alt}
								backgroundColor={project.backgroundColor}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

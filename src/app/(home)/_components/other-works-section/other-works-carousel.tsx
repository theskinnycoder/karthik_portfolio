"use client";

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
	return (
		<Carousel
			opts={{ align: "start", dragFree: true }}
			className="w-full"
		>
			<CarouselContent className="-ml-4 px-3">
				{projects.map((project) => (
					<CarouselItem
						key={project.name}
						className="basis-auto pl-4"
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
	);
}

"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { TestimonialDTO } from "@/sanity/lib/dal";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsCarousel({
	testimonials,
}: {
	testimonials: TestimonialDTO[];
}) {
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

	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-11 md:w-[calc(100%+5.5rem)]">
			<Carousel
				opts={{
					align: "start",
					loop: true,
					dragFree: true,
				}}
				plugins={[plugin.current]}
				className="w-full"
			>
				<CarouselContent className="items-stretch">
					{testimonials.map((testimonial, index) => (
						<CarouselItem
							key={`${testimonial.authorName}-${index}`}
							className="basis-[85%] md:basis-1/2 lg:basis-[45%]"
						>
							<TestimonialCard
								authorAvatar={testimonial.authorAvatar}
								authorName={testimonial.authorName}
								authorRole={testimonial.authorRole}
								company={testimonial.company}
								quote={testimonial.quote}
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

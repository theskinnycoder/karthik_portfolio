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
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				opts={{
					align: "start",
					loop: true,
					dragFree: true,
					breakpoints: {
						"(max-width: 767px)": { loop: false },
					},
				}}
				plugins={[plugin.current]}
				className="w-full"
			>
				{/* pl-4 (mobile only): insets the first card 16px from the screen
				    edge at the resting position. It lives inside the scrollable flex
				    container, so scrolling is unaffected — desktop stays full-bleed. */}
				<CarouselContent className="items-stretch pl-4 md:pl-0">
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

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
		<div className="self-center md:-mx-11 md:w-[calc(100%+5.5rem)]">
			<div className="flex w-full flex-col gap-4 md:hidden">
				{testimonials.map((testimonial, index) => (
					<div
						key={`${testimonial.authorName}-${index}`}
						className="w-full"
					>
						<TestimonialCard
							authorAvatar={testimonial.authorAvatar}
							authorName={testimonial.authorName}
							authorRole={testimonial.authorRole}
							company={testimonial.company}
							quote={testimonial.quote}
						/>
					</div>
				))}
			</div>

			<div className="relative hidden md:block">
				<Carousel
					opts={{
						align: "start",
						loop: true,
						breakpoints: {
							"(min-width: 768px)": { dragFree: true },
						},
					}}
					plugins={[plugin.current]}
					className="w-full"
				>
					<CarouselContent className="items-stretch">
						{testimonials.map((testimonial, index) => (
							<CarouselItem
								key={`${testimonial.authorName}-${index}`}
								className="basis-1/2 lg:basis-1/3"
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
					className="absolute inset-y-0 left-0 z-10 w-24"
				/>
				<ProgressiveBlur
					direction="right"
					blurLayers={8}
					blurIntensity={0.5}
					className="absolute inset-y-0 right-0 z-10 w-24"
				/>
			</div>
		</div>
	);
}

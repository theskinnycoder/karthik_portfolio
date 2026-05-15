"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
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
		<div className="w-full self-center md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
			<div className="flex w-full flex-col gap-4 md:hidden">
				{testimonials.map((testimonial, index) => (
					<div key={`${testimonial.authorName}-${index}`} className="w-full">
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

			<div className="hidden md:block">
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
			</div>
		</div>
	);
}

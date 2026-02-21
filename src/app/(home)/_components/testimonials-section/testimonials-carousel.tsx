"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

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
		<div className="w-full self-center md:w-screen md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
					{testimonials.map((testimonial) => (
						<CarouselItem
							key={testimonial.authorName}
							className="basis-[85%] md:basis-1/2 lg:basis-1/3"
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
	);
}

"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import * as React from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import useIsMobile from "@/hooks/use-media-query";
import type { TestimonialDTO } from "@/sanity/lib/dal";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsCarousel({
	testimonials,
}: {
	testimonials: TestimonialDTO[];
}) {
	const isMobile = useIsMobile()

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

	const duplicatedTestimonials = [
		...testimonials,
		...testimonials,
		...testimonials,
	];

	return (
		<div className="w-full self-center md:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
				orientation={isMobile ? "vertical" : "horizontal"}
			>
				<CarouselContent className="items-stretch">
					{duplicatedTestimonials.map((testimonial, index) => (
						<CarouselItem
							key={`${testimonial.authorName}-${index}`}
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

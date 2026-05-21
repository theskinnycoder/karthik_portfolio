"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { MediumPostDTO } from "@/lib/medium";
import { BlogCard } from "./blog-card";

interface BlogsCarouselProps {
	posts: MediumPostDTO[];
}

export function BlogsCarousel({ posts }: BlogsCarouselProps) {
	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				opts={{
					align: "start",
					loop: false,
					dragFree: true,
				}}
				className="w-full"
			>
				<CarouselContent className="ml-0 items-stretch">
					{posts.map((post, index) => (
						<CarouselItem
							key={post.link}
							className={cn(
								"pl-0 md:basis-1/2 lg:basis-[45%]",
								posts.length === 1 ? "basis-full" : "basis-[85%]",
								index > 0 && "border-l border-border",
							)}
						>
							<BlogCard post={post} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

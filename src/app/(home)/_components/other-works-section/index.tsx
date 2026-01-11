"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { HeroHeader } from "./hero-header";
import { ProductCard, type ProductCardProps } from "./product-card";

const products = [
	{
		image: "/id-card-image.svg",
		alt: "ID card design",
		backgroundColor: "#979797",
		width: 296,
		height: 458,
	},
	{
		image: "/quantum-computer-image.svg",
		alt: "Quantum computer 3D render",
		backgroundColor: "#faf9f6",
		width: 345,
		height: 458,
	},
] satisfies ProductCardProps[];

export function OtherWorksSection() {
	return (
		<section className="flex flex-col items-center gap-9">
			<HeroHeader />

			{/* Product Cards Carousel */}
			<Carousel
				opts={{ align: "start", dragFree: true }}
				className="w-full"
			>
				<CarouselContent className="-ml-4 px-3">
					{products.map((product) => (
						<CarouselItem
							key={product.image}
							className="basis-auto pl-4"
						>
							<ProductCard {...product} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</section>
	);
}

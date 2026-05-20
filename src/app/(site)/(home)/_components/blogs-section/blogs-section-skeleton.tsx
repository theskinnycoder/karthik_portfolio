import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

function SkeletonCard() {
	return (
		<div className="flex h-full animate-pulse flex-col overflow-hidden rounded-[18px] border border-border bg-card">
			{/* Image placeholder */}
			<div className="aspect-[16/9] w-full bg-muted" />

			{/* Body */}
			<div className="flex flex-1 flex-col gap-3 p-4">
				{/* Title lines */}
				<div className="h-4 w-3/4 rounded bg-muted" />
				<div className="h-4 w-1/2 rounded bg-muted" />

				{/* Excerpt lines */}
				<div className="flex-1 space-y-2 pt-1">
					<div className="h-3 w-full rounded bg-muted" />
					<div className="h-3 w-full rounded bg-muted" />
					<div className="h-3 w-2/3 rounded bg-muted" />
				</div>

				{/* Footer */}
				<div className="flex justify-between pt-1">
					<div className="h-3 w-16 rounded bg-muted" />
					<div className="h-3 w-24 rounded bg-muted" />
				</div>
			</div>
		</div>
	);
}

export function BlogsSectionSkeleton() {
	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel opts={{ align: "start" }} className="w-full">
				<CarouselContent className="items-stretch">
					{[0, 1, 2].map((i) => (
						<CarouselItem
							key={i}
							className="basis-[85%] md:basis-1/2 lg:basis-[45%]"
						>
							<SkeletonCard />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

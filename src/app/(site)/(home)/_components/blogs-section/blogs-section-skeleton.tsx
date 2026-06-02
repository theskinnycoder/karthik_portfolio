import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

function SkeletonCard() {
	return (
		<div className="flex h-full animate-pulse flex-col border-y border-border">
			<div className="flex flex-col gap-3 px-5 py-5 md:px-7">
				{/* Text + thumbnail row */}
				<div className="flex items-start gap-4">
					<div className="flex flex-1 flex-col gap-2">
						{/* Date */}
						<div className="h-3 w-16 rounded bg-muted" />
						{/* Title lines */}
						<div className="h-4 w-full rounded bg-muted" />
						<div className="h-4 w-3/4 rounded bg-muted" />
						<div className="h-4 w-1/2 rounded bg-muted" />
						{/* Excerpt lines */}
						<div className="h-3 w-full rounded bg-muted" />
						<div className="h-3 w-2/3 rounded bg-muted" />
					</div>
					{/* Thumbnail placeholder */}
					<div className="aspect-[3/2] w-28 shrink-0 rounded bg-muted" />
				</div>

				{/* "Read on Medium" row */}
				<div className="h-3 w-24 rounded bg-muted" />
			</div>
		</div>
	);
}

export function BlogsSectionSkeleton() {
	return (
		<div className="relative -mx-6 w-[calc(100%+3rem)] self-center md:-mx-[1.125rem] md:w-[calc(100%+2.25rem)]">
			<Carousel
				opts={{ align: "start" }}
				className="w-full"
			>
				<CarouselContent className="ml-0 items-stretch">
					{[0, 1, 2].map((i) => (
						<CarouselItem
							key={i}
							className="basis-[85%] pl-0 md:basis-1/2 lg:basis-[45%]"
						>
							<SkeletonCard />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

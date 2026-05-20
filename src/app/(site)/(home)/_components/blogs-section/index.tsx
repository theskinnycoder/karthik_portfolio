import Image from "next/image";
import { Suspense } from "react";
import { BlogsSectionInner } from "./blogs-section-inner";
import { BlogsSectionSkeleton } from "./blogs-section-skeleton";

export function BlogsSection() {
	return (
		<section className="flex flex-col items-center gap-7">
			<div className="flex w-full items-center gap-3">
				<h2 className="font-serif text-4xl text-foreground">Blogs</h2>
				<Image
					src="/smile.png"
					alt=""
					width={40}
					height={40}
					loading="eager"
				/>
			</div>

			<Suspense fallback={<BlogsSectionSkeleton />}>
				<BlogsSectionInner />
			</Suspense>
		</section>
	);
}

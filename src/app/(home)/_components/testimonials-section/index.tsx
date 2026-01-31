import { getSectionHeader, getTestimonials } from "@/sanity/lib/dal";
import Image from "next/image";
import { TestimonialCard } from "./testimonial-card";

export async function TestimonialsSection() {
	const [testimonials, header] = await Promise.all([
		getTestimonials(),
		getSectionHeader("testimonials"),
	]);

	const headingPrefix = header?.headingPrefix ?? "What people have to";
	const headingHighlight = header?.headingHighlight ?? "say about me :";
	const gradientFrom = header?.gradientFrom ?? "#A88BFA";
	const gradientTo = header?.gradientTo ?? "#EFAAFB";
	const icon = header?.icon;

	return (
		<section className="flex flex-col items-center gap-7">
			<h2 className="text-center font-serif text-4xl">
				{headingPrefix && (
					<span className="text-muted-foreground">{headingPrefix} </span>
				)}
				<div className="inline-flex items-baseline space-x-2 md:inline">
					<span
						className="bg-clip-text text-transparent"
						style={{
							backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
						}}
					>
						{headingHighlight}
					</span>
					{icon ? (
						<Image
							src={icon}
							alt=""
							width={20}
							height={20}
							className="inline"
						/>
					) : (
						<Image
							src="/icons/heart-icon.svg"
							alt="heart icon"
							width={20}
							height={20}
							className="inline"
						/>
					)}
				</div>
			</h2>

			<div className="flex w-full flex-col gap-[18px]">
				{testimonials.map((testimonial) => (
					<TestimonialCard
						key={testimonial.authorName}
						authorAvatar={testimonial.authorAvatar}
						authorName={testimonial.authorName}
						authorRole={testimonial.authorRole}
						company={testimonial.company}
						quote={testimonial.quote}
					/>
				))}
			</div>
		</section>
	);
}

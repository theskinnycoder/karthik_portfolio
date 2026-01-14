import { getTestimonials } from "@/sanity/lib/dal";
import Image from "next/image";
import { TestimonialCard } from "./testimonial-card";

export async function TestimonialsSection() {
	const testimonials = await getTestimonials();

	return (
		<section className="flex flex-col items-center gap-7">
			<h2 className="text-center font-serif text-4xl">
				<span className="text-muted-foreground">What people have to </span>
				<div className="inline-flex items-baseline space-x-2 md:inline">
					<span className="bg-linear-to-r from-[#A88BFA] to-[#EFAAFB] bg-clip-text text-transparent">
						say about me :
					</span>
					<Image
						src="/icons/heart-icon.svg"
						alt="heart icon"
						width={20}
						height={20}
						className="inline"
					/>
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

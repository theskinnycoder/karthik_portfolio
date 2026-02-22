import GradientText from "@/components/GradientText";
import { MediaImage } from "@/components/media";
import { getSectionHeader, getTestimonials } from "@/sanity/lib/dal";
import { TestimonialsCarousel } from "./testimonials-carousel";

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
					<GradientText
						colors={[gradientFrom, gradientTo]}
						direction="horizontal"
						className="mx-0 mr-2 inline-flex! font-serif text-4xl"
					>
						{headingHighlight}
					</GradientText>
					{icon && (
						<MediaImage
							src={icon}
							alt=""
							width={20}
							height={20}
							loading="eager"
							className="inline"
						/>
					)}
				</div>
			</h2>

			<TestimonialsCarousel testimonials={testimonials} />
		</section>
	);
}

import { MediaImage } from "@/components/media";
import { PortableTextRenderer } from "@/components/portable-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ContentTestimonialDTO } from "@/sanity/lib/dal";

interface ContentTestimonialProps {
	value: ContentTestimonialDTO;
}

/**
 * Inline testimonial block. Wraps a quote + author row in a card that adopts
 * the workItem's brand-primary as its border color when set.
 */
export function ContentTestimonial({ value }: ContentTestimonialProps) {
	const { testimonial } = value;
	const initials = getInitials(testimonial.authorName);

	return (
		<figure className="my-8 flex flex-col gap-6 rounded-2xl border border-[var(--brand-primary,var(--color-border))] bg-card p-6">
			<blockquote className="text-lg leading-relaxed font-light text-card-foreground/60 italic before:content-['“'] after:content-['”']">
				<PortableTextRenderer
					value={testimonial.quote}
					variant="base"
				/>
			</blockquote>
			<figcaption className="flex items-center gap-3">
				<Avatar className="size-10">
					<AvatarImage
						src={testimonial.authorAvatar}
						alt={testimonial.authorName}
						className="object-top"
					/>
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="text-base font-semibold text-card-foreground">
						{testimonial.authorName}
					</span>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
						<span className="text-xs font-light text-card-foreground/60">
							{testimonial.authorRole}
						</span>
						{testimonial.company.logo && (
							<MediaImage
								src={testimonial.company.logo}
								alt={testimonial.company.name}
								width={0}
								height={0}
								className="h-3.5 w-auto shrink-0"
								sizes="100vw"
							/>
						)}
					</div>
				</div>
			</figcaption>
		</figure>
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

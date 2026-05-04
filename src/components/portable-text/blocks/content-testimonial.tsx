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
		<figure className="not-prose my-8 flex flex-col gap-[18px] rounded-[18px] border border-border bg-card px-3.5 py-4.5">
			<div className="flex flex-col gap-4">
				{testimonial.company.logo && (
					<MediaImage
						src={testimonial.company.logo}
						alt={testimonial.company.name}
						width={0}
						height={0}
						className="h-[18px] w-auto shrink-0 self-start"
						sizes="100vw"
					/>
				)}
				<blockquote className="text-[14px] leading-[22px] font-normal text-muted-foreground">
					<PortableTextRenderer
						value={testimonial.quote}
						variant="base"
					/>
				</blockquote>
			</div>
			<figcaption className="flex items-center gap-3">
				<Avatar className="size-[35px]">
					<AvatarImage
						src={testimonial.authorAvatar}
						alt={testimonial.authorName}
						className="object-top"
					/>
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-1">
					<span className="text-xs font-semibold text-foreground">
						{testimonial.authorName}
					</span>
					<span className="text-xs font-normal text-foreground">
						{testimonial.authorRole}
					</span>
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

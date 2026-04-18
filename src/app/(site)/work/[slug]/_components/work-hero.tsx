import { MediaImage } from "@/components/media";

interface WorkHeroProps {
	src: string;
	alt: string;
}

export function WorkHero({ src, alt }: WorkHeroProps) {
	// Guard against empty src — the DAL may return "" when both heroImage and
	// the card image are missing. Rendering <Image src=""> triggers runtime
	// warnings, so skip the element entirely in that case.
	if (!src) return null;

	return (
		<div className="overflow-hidden rounded-2xl border border-border bg-card">
			<MediaImage
				src={src}
				alt={alt}
				width={1600}
				height={900}
				className="h-auto w-full object-cover"
				priority
			/>
		</div>
	);
}

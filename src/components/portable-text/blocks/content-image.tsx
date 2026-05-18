import { MediaImage } from "@/components/media";
import { cn } from "@/lib/utils";
import type { ContentImageDTO } from "@/sanity/lib/dal";

interface ContentImageProps {
	value: ContentImageDTO;
}

export function ContentImage({ value }: ContentImageProps) {
	if (!value.url) return null;
	const dimensions = sizeToDimensions(value.size);
	return (
		<figure className="my-8">
			<MediaImage
				src={value.url}
				alt={value.alt}
				width={dimensions.width}
				height={dimensions.height}
				className="w-full object-cover"
			/>
			{value.caption && (
				<figcaption className="mt-2 text-center text-xs font-light text-muted-foreground">
					{value.caption}
				</figcaption>
			)}
		</figure>
	);
}

function sizeToDimensions(size: ContentImageDTO["size"]) {
	switch (size) {
		case "full":
			return { width: 1600, height: 900 };
		case "wide":
			return { width: 1400, height: 787 };
		case "inline":
		default:
			return { width: 1200, height: 675 };
	}
}

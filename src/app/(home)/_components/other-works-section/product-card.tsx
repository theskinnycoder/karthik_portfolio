import { MediaImage } from "@/components/media";

export interface ProductCardProps {
	image: string;
	alt: string;
	name: string;
	backgroundColor: string;
}

export function ProductCard({ image, alt, backgroundColor }: ProductCardProps) {
	return (
		<div
			className="h-full overflow-hidden rounded-[14px]"
			style={{ backgroundColor }}
		>
			<MediaImage
				src={image}
				alt={alt}
				width={296}
				height={458}
				className="size-full object-cover"
			/>
		</div>
	);
}

import Image from "next/image";

export interface ProductCardProps {
	image: string;
	alt: string;
	backgroundColor: string;
	width?: number;
	height?: number;
}

export function ProductCard({
	image,
	alt,
	backgroundColor,
	width = 296,
	height = 458,
}: ProductCardProps) {
	return (
		<div
			className="shrink-0 overflow-hidden rounded-[14px]"
			style={{ backgroundColor, width, height }}
		>
			<Image
				src={image}
				alt={alt}
				width={width}
				height={height}
				className="size-full object-cover"
			/>
		</div>
	);
}

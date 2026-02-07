import Image, { type ImageProps } from "next/image";

export interface MediaImageProps extends Omit<
	ImageProps,
	"src" | "unoptimized"
> {
	src: string;
}

export function MediaImage({ src, alt, ...props }: MediaImageProps) {
	return (
		<Image
			src={src}
			alt={alt}
			unoptimized
			{...props}
		/>
	);
}

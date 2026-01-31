"use client";

import { CldImage, type CldImageProps } from "next-cloudinary";

export interface MediaImageProps extends Omit<
	CldImageProps,
	"src" | "alt" | "width" | "height"
> {
	publicId: string;
	alt: string;
	width: number;
	height: number;
}

export function MediaImage({
	publicId,
	alt,
	width,
	height,
	...props
}: MediaImageProps) {
	return (
		<CldImage
			src={publicId}
			alt={alt}
			width={width}
			height={height}
			{...props}
		/>
	);
}

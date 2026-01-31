"use client";

import { CldVideoPlayer, type CldVideoPlayerProps } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

export interface MediaVideoProps extends Omit<
	CldVideoPlayerProps,
	"src" | "width" | "height"
> {
	publicId: string;
	width: number;
	height: number;
}

export function MediaVideo({
	publicId,
	width,
	height,
	...props
}: MediaVideoProps) {
	return (
		<CldVideoPlayer
			src={publicId}
			width={width}
			height={height}
			{...props}
		/>
	);
}

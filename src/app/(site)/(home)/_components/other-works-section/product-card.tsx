"use client";

import { MediaImage } from "@/components/media";
import { motion } from "motion/react";
export interface ProductCardProps {
	image: string;
	description: string;
	name: string;
	backgroundColor: string;
	navigateUrl?: string;
}

export function ProductCard({
	image,
	description,
	name,
	backgroundColor,
	navigateUrl,
}: ProductCardProps) {
	return (
		<motion.div
			className={`relative h-[380px] overflow-hidden rounded-[14px] ${navigateUrl ? "cursor-pointer" : "cursor-default"}`}
			style={{ backgroundColor }}
			onClick={() => navigateUrl && window.open(navigateUrl, "_blank")}
			whileHover={{ scale: 0.98 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			<MediaImage
				src={image}
				alt={description}
				width={0}
				height={0}
				sizes="(max-width: 768px) 90vw, 400px"
				className="block h-full w-auto"
			/>

			<div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/35 via-black/10 to-transparent [mask-image:linear-gradient(to_top,black_70%,transparent_100%)] backdrop-blur-sm">
				<div className="flex flex-col items-end gap-0 px-5 py-4 text-left">
					<p className="max-w-sm truncate text-base font-medium text-white">
						{name}
					</p>
					<span className="text-sm text-zinc-300">{description}</span>
				</div>
			</div>
		</motion.div>
	);
}

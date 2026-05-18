import useIsMobile from "@/hooks/use-media-query";
import { motion } from "motion/react";
import React from "react";
export interface ProductCardProps {
	image: string;
	description: string;
	name: string;
	backgroundColor: string;
	navigateUrl: string;
}

export function ProductCard({
	image,
	description,
	name,
	backgroundColor,
	navigateUrl,
}: ProductCardProps) {
	const [isHover, setIsHover] = React.useState<boolean>(false);
	const isMobile = useIsMobile();

	return (
		<div
			className="relative h-[380px] cursor-pointer overflow-hidden rounded-[14px]"
			style={{ backgroundColor }}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			onClick={() => window.open(navigateUrl, "_blank")}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={image}
				alt={description}
				className="block h-full w-auto"
			/>

			<motion.div
				className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/35 via-black/10 to-transparent [mask-image:linear-gradient(to_top,black_70%,transparent_100%)] backdrop-blur-sm"
				animate={isMobile ? "visible" : isHover ? "visible" : "hidden"}
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}}
				transition={{ duration: 0.2, ease: "easeOut" }}
			>
				<div className="flex flex-col items-end gap-0 px-5 py-4 text-left">
					<p className="max-w-sm truncate text-base font-medium text-white">
						{name}
					</p>
					<span className="text-sm text-zinc-300">{description}</span>
				</div>
			</motion.div>
		</div>
	);
}

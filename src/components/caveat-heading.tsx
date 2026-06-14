"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function CaveatHeading({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<motion.h2
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			viewport={{ once: true, margin: "-100px" }}
			className={cn(
				"text-left font-serif text-5xl font-semibold text-foreground",
				className,
			)}
		>
			{text}
		</motion.h2>
	);
}

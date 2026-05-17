"use client";

import { inlineMarks } from "@/components/portable-text/inline-marks";
import { motion } from "motion/react";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

const inlineComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => <>{children}</>,
		h1: ({ children }) => <>{children}</>,
		h2: ({ children }) => <>{children}</>,
		h3: ({ children }) => <>{children}</>,
		h4: ({ children }) => <>{children}</>,
		h5: ({ children }) => <>{children}</>,
		h6: ({ children }) => <>{children}</>,
	},
	marks: inlineMarks,
};

const fadeUp = {
	initial: { y: 48, opacity: 0 },
	whileInView: { y: 0, opacity: 1 },
	viewport: { once: true, margin: "0px 0px -40px 0px" },
};

interface HeroSectionProps {
	name: PortableTextBlock[] | null;
	title: PortableTextBlock[] | null;
}

export function HeroSection({ name, title }: HeroSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<motion.h1
				{...fadeUp}
				transition={{ ease: "easeOut", duration: 0.6 }}
				className="text-4xl font-semibold text-foreground"
			>
				{name?.length ? (
					<PortableText value={name} components={inlineComponents} />
				) : (
					"Karthik Panchala"
				)}
			</motion.h1>
			<motion.p
				{...fadeUp}
				transition={{ ease: "easeOut", duration: 0.6, delay: 0.15 }}
				className="text-3xl font-semibold text-muted-foreground"
			>
				{title?.length ? (
					<PortableText value={title} components={inlineComponents} />
				) : (
					"Product Designer"
				)}
			</motion.p>
		</div>
	);
}

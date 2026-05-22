"use client";

import GradientText from "@/components/GradientText";
import { inlineMarks } from "@/components/portable-text/inline-marks";
import { COLOR_DECORATORS } from "@/sanity/rich-text/constants";
import { motion } from "motion/react";
import {
	PortableText,
	type PortableTextBlock,
	type PortableTextComponents,
} from "next-sanity";
import type { ReactNode } from "react";

const passThrough = ({ children }: { children?: ReactNode }) => <>{children}</>;

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

// Title variant: color marks are stripped so the GradientText shines through.
// The Sanity editor applies colorMuted to the title text; keeping it would
// inject `style={{ color: "var(--muted-foreground)" }}` which overrides
// GradientText's `text-transparent` / `bg-clip-text`.
const titleComponents: PortableTextComponents = {
	...inlineComponents,
	marks: {
		...inlineMarks,
		...Object.fromEntries(COLOR_DECORATORS.map((c) => [c, passThrough])),
	},
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
					<PortableText
						value={name}
						components={inlineComponents}
					/>
				) : (
					"Karthik Panchala"
				)}
			</motion.h1>
			<motion.div
				{...fadeUp}
				transition={{ ease: "easeOut", duration: 0.6, delay: 0.15 }}
			>
				<GradientText
					colors={["#FBBA27", "#FB7481"]}
					direction="horizontal"
					animationSpeed={8}
					className="mx-0 inline-flex! overflow-visible rounded-none text-3xl font-semibold"
				>
					{title?.length ? (
						<PortableText
							value={title}
							components={titleComponents}
						/>
					) : (
						"Product Designer"
					)}
				</GradientText>
			</motion.div>
		</div>
	);
}

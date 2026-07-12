"use client";

// Gradient text disabled for now — see the commented <GradientText> usage below to restore.
// import GradientText from "@/components/GradientText";
import { inlineMarks, WEIGHTS } from "@/components/portable-text/inline-marks";
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

// Title variant: color and weight marks are stripped so the tagline always
// renders in the wrapper's flat --paragraph color at font-normal (400),
// regardless of what's authored in Sanity. Color-stripping originally existed
// so GradientText's `text-transparent` / `bg-clip-text` would shine through;
// weight-stripping was added when the tagline was pinned to 400.
const titleComponents: PortableTextComponents = {
	...inlineComponents,
	marks: {
		...inlineMarks,
		...Object.fromEntries(COLOR_DECORATORS.map((c) => [c, passThrough])),
		...Object.fromEntries(WEIGHTS.map((w) => [`weight${w}`, passThrough])),
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
				{/* Gradient text disabled for now — restore by uncommenting this and the import above.
				<GradientText
					colors={["#FBBA27", "#FB7481"]}
					direction="horizontal"
					animationSpeed={8}
					className="mx-0 inline-flex! overflow-visible rounded-none text-3xl font-semibold md:max-w-[480px]! xl:max-w-fit!"
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
				*/}
				<span className="text-3xl font-normal text-paragraph">
					{title?.length ? (
						<PortableText
							value={title}
							components={titleComponents}
						/>
					) : (
						"Product Designer"
					)}
				</span>
			</motion.div>
		</div>
	);
}

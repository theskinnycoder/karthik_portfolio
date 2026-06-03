"use client";

import { motion } from "motion/react";

interface FadeInSectionProps {
	children: React.ReactNode;
}

export function FadeInSection({ children }: FadeInSectionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.45, ease: "easeOut" }}
		>
			{children}
		</motion.div>
	);
}

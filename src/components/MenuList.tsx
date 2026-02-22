"use client";

import { motion } from "motion/react";
import type { PropsWithChildren } from "react";

type MenuListItemProps = PropsWithChildren;

export const MenuListItem = ({ children }: MenuListItemProps) => {
	return (
		<motion.div
			initial={{ y: 48, opacity: 0 }}
			whileInView={{ y: 0, opacity: 1 }}
			transition={{ ease: "easeInOut", duration: 0.75 }}
			className="flex items-center justify-between border-b py-4"
		>
			{children}
		</motion.div>
	);
};

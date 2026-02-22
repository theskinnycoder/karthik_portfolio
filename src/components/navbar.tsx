"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
	{ label: "About", href: "/" },
	{ label: "Work", href: "/work" },
	{ label: "Blogs", href: "/blogs" },
] as const;

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav
			data-slot="navbar"
			className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
			aria-label="Main navigation"
		>
			<div className="flex items-center rounded-full border border-border bg-card p-2">
				{NAV_ITEMS.map((item) => {
					const isActive =
						item.href === "/"
							? pathname === "/"
							: pathname.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"relative rounded-full px-3.5 py-1.5 text-base font-semibold tracking-[0.32px] transition-colors",
								isActive
									? "text-foreground"
									: "text-muted-foreground hover:text-foreground/80",
							)}
							aria-current={isActive ? "page" : undefined}
						>
							{isActive && (
								<motion.span
									layoutId="navbar-active-pill"
									className="absolute inset-0 rounded-full bg-border"
									transition={{
										type: "spring",
										stiffness: 380,
										damping: 30,
									}}
								/>
							)}
							<span className="relative z-10">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

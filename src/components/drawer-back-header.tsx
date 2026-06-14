"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

type DrawerBackHeaderProps = {
	/** Text shown next to the back arrow. Defaults to "Back to Work". */
	label?: string;
} & (
	| { href: ComponentProps<typeof Link>["href"]; onBack?: never }
	| { onBack: () => void; href?: never }
);

export function DrawerBackHeader({
	href,
	onBack,
	label = "Back to Work",
}: DrawerBackHeaderProps) {
	const className =
		"group inline-flex w-fit items-center gap-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80";
	const content = (
		<>
			<span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-95">
				<ArrowLeft className="size-4" />
			</span>
			{label}
		</>
	);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/75 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-2xl items-center px-6 py-3.5">
				{href != null ? (
					<Link
						href={href}
						className={className}
					>
						{content}
					</Link>
				) : (
					<button
						onClick={onBack}
						className={className}
					>
						{content}
					</button>
				)}
			</div>
		</header>
	);
}

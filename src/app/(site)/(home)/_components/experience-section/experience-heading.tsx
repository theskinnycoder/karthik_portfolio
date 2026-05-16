"use client";

import SplitText from "@/components/SplitText";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export function ExperienceHeading({ text }: { text: string }) {
	const [gifVisible, setGifVisible] = useState(false);

	return (
		<>
			<SplitText
				text={text}
				tag="h2"
				className="text-center text-3xl font-semibold text-foreground"
				splitType="chars"
				onLastCharStart={() => setGifVisible(true)}
			/>
			<Image
				src="/Blink.gif"
				alt=""
				width={60}
				height={60}
				unoptimized
				className={cn(
					"pointer-events-none absolute top-[-22px] right-[-35px] z-10 rotate-[-35deg] transition-opacity duration-500",
					gifVisible ? "opacity-100" : "opacity-0",
				)}
			/>
		</>
	);
}

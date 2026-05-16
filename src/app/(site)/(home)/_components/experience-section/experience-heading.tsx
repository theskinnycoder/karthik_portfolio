"use client";

import SplitText from "@/components/SplitText";

export function ExperienceHeading({ text }: { text: string }) {
	return (
		<SplitText
			text={text}
			tag="h2"
			className="text-center text-3xl font-semibold text-foreground"
			splitType="chars"
		/>
	);
}

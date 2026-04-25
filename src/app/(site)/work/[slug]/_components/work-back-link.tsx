import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Filled circular back-chip + label shown at the very top of a case study.
 * Matches Figma 538:494: a 28×28 `bg-foreground` pill with a cream icon,
 * followed by the "Go Back" label. Under the work-detail theme, foreground
 * resolves to #212121 and background to #faf9f6, so the chip reads as a dark
 * coin on the cream page.
 */
export function WorkBackLink() {
	return (
		<Link
			href="/work"
			className="group inline-flex w-fit items-center gap-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
		>
			<span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background">
				<ArrowLeft className="size-4" />
			</span>
			Go Back
		</Link>
	);
}

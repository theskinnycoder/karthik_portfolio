import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function WorkBackLink() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-foreground/[0.06] bg-background/75 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-2xl items-center px-6 py-3.5">
				<Link
					href="/work"
					className="group inline-flex w-fit items-center gap-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
				>
					<span className="flex size-7 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-95">
						<ArrowLeft className="size-4" />
					</span>
					Go Back
				</Link>
			</div>
		</header>
	);
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function WorkBackLink() {
	return (
		<Link
			href="/work"
			className="inline-flex w-fit items-center gap-1.5 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft className="size-4" />
			Back to work
		</Link>
	);
}

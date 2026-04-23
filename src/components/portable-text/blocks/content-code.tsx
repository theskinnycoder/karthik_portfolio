import type { ContentCodeDTO } from "@/sanity/lib/dal";

interface ContentCodeProps {
	value: ContentCodeDTO;
}

/**
 * Fenced code block. Plain monospace rendering — no syntax highlighting
 * (intentional: keeps the bundle light). A `filename` label sits above the
 * block when provided; otherwise the language tag is shown instead so the
 * reader can still orient at a glance.
 */
export function ContentCode({ value }: ContentCodeProps) {
	const label = value.filename ?? value.language;

	return (
		<figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-muted">
			{label && (
				<div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
					<span>{label}</span>
					{value.filename && value.language && (
						<span className="font-light">{value.language}</span>
					)}
				</div>
			)}
			<pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed">
				<code className="font-mono text-foreground">{value.code}</code>
			</pre>
		</figure>
	);
}

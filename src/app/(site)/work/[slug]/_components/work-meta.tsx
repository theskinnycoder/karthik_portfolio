import { ArrowUpRight } from "lucide-react";
import type { WorkItemDetailDTO } from "@/sanity/lib/dal";

interface WorkMetaProps {
	work: WorkItemDetailDTO;
}

interface MetaItem {
	label: string;
	value: string;
}

export function WorkMeta({ work }: WorkMetaProps) {
	const items: MetaItem[] = [
		{ label: "Role", value: work.role },
		{ label: "Year", value: work.year },
		...(work.duration ? [{ label: "Duration", value: work.duration }] : []),
		{ label: "Company", value: work.company.name },
	];

	return (
		<div className="flex flex-col gap-6 border-y border-border py-6">
			<dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
				{items.map((item) => (
					<div
						key={item.label}
						className="flex flex-col gap-1"
					>
						<dt className="text-xs font-light tracking-wide text-muted-foreground uppercase">
							{item.label}
						</dt>
						<dd className="text-sm font-medium text-foreground">
							{item.value}
						</dd>
					</div>
				))}
			</dl>
			{work.stack && work.stack.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="text-xs font-light tracking-wide text-muted-foreground uppercase">
						Stack
					</span>
					<div className="flex flex-wrap gap-2">
						{work.stack.map((tool) => (
							<span
								key={tool}
								className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-light text-muted-foreground"
							>
								{tool}
							</span>
						))}
					</div>
				</div>
			)}
			{work.liveUrl && (
				<a
					href={work.liveUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
				>
					Visit live project
					<ArrowUpRight className="size-4" />
				</a>
			)}
		</div>
	);
}

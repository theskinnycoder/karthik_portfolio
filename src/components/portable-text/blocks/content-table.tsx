import type { ContentTableDTO } from "@/sanity/lib/dal";

interface ContentTableProps {
	value: ContentTableDTO;
}

/**
 * Renders a `contentTable` block as a scrollable edge-to-edge table.
 * -mx-6 breaks out of the prose px-6 container so the table spans full width.
 * First/last cells use pl-6/pr-6 so content aligns with the surrounding text
 * on initial load; overflow-x-auto lets the user scroll when columns overflow.
 */
export function ContentTable({ value }: ContentTableProps) {
	const hasHeaders = value.headers.length > 0;
	const hasRows = value.rows.length > 0;

	if (!hasHeaders && !hasRows) return null;

	return (
		<div className="not-prose -mx-6 my-8 flex flex-col gap-3">
			<div className="overflow-x-auto border-y border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<table className="min-w-full border-collapse">
					{hasHeaders && (
						<thead>
							<tr className="border-b border-border bg-muted">
								{value.headers.map((header, i) => (
									<th
										key={`h-${i}`}
										className="px-4 py-2.5 text-left text-[1.125rem] font-semibold tracking-wide whitespace-nowrap text-foreground first:pl-6 last:pr-6 md:text-[1.25rem] lg:text-[1.375rem]"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
					)}
					{hasRows && (
						<tbody>
							{value.rows.map((cells, ri) => (
								<tr
									key={`r-${ri}`}
									className="border-b border-border last:border-0 odd:bg-card even:bg-muted/40"
								>
									{cells.map((cell, ci) => (
										<td
											key={`c-${ci}`}
											className="px-4 py-2.5 text-[1.0625rem] font-normal whitespace-nowrap text-paragraph first:pl-6 last:pr-6 md:text-[1.125rem] lg:text-[1.25rem]"
										>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
			{value.caption && (
				<p className="px-6 text-center text-[1.0625rem] font-normal text-muted-foreground md:text-[1.125rem] lg:text-[1.25rem]">
					{value.caption}
				</p>
			)}
		</div>
	);
}

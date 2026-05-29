import type { ContentTableDTO } from "@/sanity/lib/dal";

interface ContentTableProps {
	value: ContentTableDTO;
}

/**
 * Renders a `contentTable` block as a responsive scrollable HTML table.
 * First row of `headers` becomes `<th>` cells; each item in `rows` becomes a `<tr>`.
 */
export function ContentTable({ value }: ContentTableProps) {
	const hasHeaders = value.headers.length > 0;
	const hasRows = value.rows.length > 0;

	if (!hasHeaders && !hasRows) return null;

	return (
		<figure className="not-prose my-8 flex flex-col gap-3">
			<div className="overflow-x-auto rounded-[0.375rem] border border-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
				<table className="w-full border-collapse text-sm">
					{hasHeaders && (
						<thead>
							<tr className="border-b border-border bg-muted">
								{value.headers.map((header, i) => (
									<th
										key={`h-${i}`}
										className="px-4 py-2.5 text-left text-[1.125rem] font-semibold tracking-wide text-foreground whitespace-nowrap md:text-[1.25rem] lg:text-[1.375rem]"
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
											className="px-4 py-2.5 text-[1.125rem] font-normal text-paragraph md:text-[1.25rem] lg:text-[1.375rem]"
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
				<p className="text-center text-[1.125rem] font-normal text-muted-foreground md:text-[1.25rem] lg:text-[1.375rem]">
					{value.caption}
				</p>
			)}
		</figure>
	);
}

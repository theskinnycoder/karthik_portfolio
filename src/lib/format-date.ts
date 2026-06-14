/**
 * Format an ISO date string (YYYY-MM-DD) as "MMM YYYY", e.g. "Jun 2024".
 * Parsed as UTC to avoid the day shifting across timezones. Returns the raw
 * input unchanged if it can't be parsed.
 */
export function formatMonthYear(iso: string): string {
	if (!iso) return "";
	const date = new Date(`${iso}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
}

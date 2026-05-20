import { XMLParser } from "fast-xml-parser";

export interface MediumPostDTO {
	title: string;
	link: string;
	pubDate: string; // ISO 8601
	excerpt: string; // Plain text, max ~200 chars
	thumbnail: string | null; // First image from content:encoded, or null
}

const MEDIUM_RSS_URL = "https://medium.com/feed/@panchalakarthik123";

/** Extract the first image src from Medium's content:encoded HTML */
function extractThumbnail(html: string): string | null {
	const match = html.match(/<img[^>]+src="([^"]+)"/);
	return match?.[1] ?? null;
}

/** Strip HTML tags and truncate to ~200 chars */
function extractExcerpt(html: string): string {
	const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	if (plain.length <= 200) return plain;
	// Truncate at a word boundary
	return plain.slice(0, 200).replace(/\s+\S*$/, "") + "…";
}

/** Fetch and parse the Medium RSS feed. Returns [] on any error. */
export async function getMediumPosts(): Promise<MediumPostDTO[]> {
	try {
		const response = await fetch(MEDIUM_RSS_URL, { cache: "no-store" });
		if (!response.ok) return [];

		const xml = await response.text();

		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
			// Preserve CDATA content (Medium wraps HTML in CDATA)
			cdataPropName: "__cdata",
		});
		const parsed = parser.parse(xml) as {
			rss?: { channel?: { item?: unknown } };
		};

		const rawItems = parsed?.rss?.channel?.item;
		// fast-xml-parser returns a single object (not array) when there is only one item
		const items: unknown[] = Array.isArray(rawItems)
			? rawItems
			: rawItems
				? [rawItems]
				: [];

		const posts: MediumPostDTO[] = items.map((item) => {
			const i = item as Record<string, unknown>;

			// content:encoded may be wrapped in __cdata by the parser
			const rawContent = i["content:encoded"];
			const contentEncoded =
				typeof rawContent === "object" && rawContent !== null
					? String((rawContent as Record<string, unknown>)["__cdata"] ?? "")
					: String(rawContent ?? "");

			// description is a shorter HTML excerpt Medium provides
			const rawDesc = i.description;
			const description =
				typeof rawDesc === "object" && rawDesc !== null
					? String((rawDesc as Record<string, unknown>)["__cdata"] ?? "")
					: String(rawDesc ?? "");

			const excerptSource = description || contentEncoded;

			// Safe date parsing: guard against RangeError if date is missing/malformed
			const rawPubDate = String(i.pubDate ?? "");
			const parsedDate = new Date(rawPubDate);

			return {
				title: String(i.title ?? "").trim(),
				link: String(i.link ?? i.guid ?? "").trim(),
				pubDate: Number.isNaN(parsedDate.getTime()) ? rawPubDate : parsedDate.toISOString(),
				excerpt: extractExcerpt(excerptSource),
				thumbnail: extractThumbnail(contentEncoded),
			};
		});

		// Newest first
		return posts.sort(
			(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
		);
	} catch (error) {
		console.error("[medium] Failed to fetch RSS feed:", error);
		return [];
	}
}

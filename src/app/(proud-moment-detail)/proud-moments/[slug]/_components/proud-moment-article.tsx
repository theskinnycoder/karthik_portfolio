import { PortableTextRenderer } from "@/components/portable-text";
import type { HighlightDetailDTO } from "@/sanity/lib/dal";
import { ProudMomentPrevNext } from "./proud-moment-prev-next";

interface ProudMomentArticleProps {
	highlight: HighlightDetailDTO;
	hideNav?: boolean;
}

export function ProudMomentArticle({
	highlight,
	hideNav = false,
}: ProudMomentArticleProps) {
	const hasNavigation = !hideNav && Boolean(highlight.prev || highlight.next);

	return (
		<article className="flex flex-col gap-10">
			{highlight.content.length > 0 && (
				<PortableTextRenderer
					value={highlight.content}
					variant="article"
				/>
			)}

			{hasNavigation && (
				<ProudMomentPrevNext
					prev={highlight.prev}
					next={highlight.next}
				/>
			)}
		</article>
	);
}

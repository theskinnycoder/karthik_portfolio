import type { CSSProperties } from "react";
import { PortableTextRenderer } from "@/components/portable-text";
import type { BrandDTO, WorkItemDetailDTO } from "@/sanity/lib/dal";
import { WorkBackLink } from "./work-back-link";
import { WorkPrevNext } from "./work-prev-next";

interface WorkArticleProps {
	work: WorkItemDetailDTO;
}

/**
 * Brand colors are applied to the article root as CSS custom properties so
 * every descendant (including portable-text blocks nested arbitrarily deep)
 * can reference them via `var(--brand-primary, var(--color-foreground))`
 * style fallbacks. Leaving brand unset falls back to the site's grayscale
 * tokens automatically.
 */
function toBrandStyle(brand: BrandDTO): CSSProperties {
	const style: Record<string, string> = {};
	if (brand.primary) style["--brand-primary"] = brand.primary;
	if (brand.secondary) style["--brand-secondary"] = brand.secondary;
	if (brand.accent) style["--brand-accent"] = brand.accent;
	if (brand.muted) style["--brand-muted"] = brand.muted;
	return style as CSSProperties;
}

export function WorkArticle({ work }: WorkArticleProps) {
	const hasNavigation = Boolean(work.prev || work.next);

	return (
		<article
			className="flex flex-col gap-10"
			style={toBrandStyle(work.brand)}
		>
			<WorkBackLink />
			<h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
				{work.title}
			</h1>
			{work.content.length > 0 && (
				<PortableTextRenderer
					value={work.content}
					variant="article"
				/>
			)}
			{hasNavigation && (
				<WorkPrevNext
					prev={work.prev}
					next={work.next}
				/>
			)}
		</article>
	);
}

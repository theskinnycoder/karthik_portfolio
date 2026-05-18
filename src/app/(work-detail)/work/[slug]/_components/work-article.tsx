import type { CSSProperties } from "react";
import { PortableTextRenderer } from "@/components/portable-text";
import type { BrandDTO, WorkItemDetailDTO } from "@/sanity/lib/dal";
import { WorkPrevNext } from "./work-prev-next";

interface WorkArticleProps {
	work: WorkItemDetailDTO;
}

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

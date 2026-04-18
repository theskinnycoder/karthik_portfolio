import { PortableTextRenderer } from "@/components/portable-text";
import type { WorkItemDetailDTO } from "@/sanity/lib/dal";
import { WorkBackLink } from "./work-back-link";
import { WorkHero } from "./work-hero";
import { WorkMeta } from "./work-meta";

interface WorkArticleProps {
	work: WorkItemDetailDTO;
}

export function WorkArticle({ work }: WorkArticleProps) {
	const lede = work.excerpt ?? work.description;

	return (
		<article className="flex flex-col gap-10">
			<WorkBackLink />
			<header className="flex flex-col gap-6">
				<WorkHero
					src={work.heroImage}
					alt={work.title}
				/>
				<div className="flex flex-col gap-3">
					<span className="w-fit rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
						{work.tag}
					</span>
					<h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
						{work.title}
					</h1>
					{lede && (
						<p className="text-base font-light text-muted-foreground sm:text-lg">
							{lede}
						</p>
					)}
				</div>
				<WorkMeta work={work} />
			</header>
			{work.content.length > 0 && (
				<div className="flex flex-col gap-4">
					<PortableTextRenderer
						value={work.content}
						variant="article"
					/>
				</div>
			)}
		</article>
	);
}

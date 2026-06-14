"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachePageLife } from "@/lib/caching";
import { getAllHighlightSlugs, getHighlightBySlug } from "@/sanity/lib/dal";
import { ProudMomentDetailDrawerShell } from "./_components/proud-moment-detail-drawer-shell";

interface ProudMomentDetailPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getAllHighlightSlugs();
	return slugs.map((slug) => ({ slug }));
}

// Note: `dynamicParams` route segment config is incompatible with Cache
// Components. Unknown slugs render on demand inside the `"use cache"`
// boundary by default; the Sanity webhook revalidates the `highlights` tag
// to keep content fresh.

export async function generateMetadata({
	params,
}: ProudMomentDetailPageProps): Promise<Metadata> {
	cachePageLife();
	const { slug } = await params;
	const highlight = await getHighlightBySlug(slug);
	if (!highlight) return {};
	return {
		title: `${highlight.title} · Karthik`,
		description: highlight.description,
		openGraph: {
			title: highlight.title,
			description: highlight.description,
			images: highlight.image ? [highlight.image] : undefined,
		},
	};
}

export default async function ProudMomentDetailPage({
	params,
}: ProudMomentDetailPageProps) {
	cachePageLife();
	const { slug } = await params;
	const highlight = await getHighlightBySlug(slug);
	if (!highlight) notFound();

	// Reuse the warm light palette from the work case-study route — the detail
	// layout shares the same visual treatment.
	return (
		<div
			data-theme="work-detail"
			className="min-h-dvh bg-background text-foreground"
		>
			<ProudMomentDetailDrawerShell highlight={highlight} />
		</div>
	);
}

"use cache";

import { toPlainText } from "@portabletext/toolkit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachePageLife } from "@/lib/caching";
import { getAllWorkItemSlugs, getWorkItemBySlug } from "@/sanity/lib/dal";
import { WorkDetailDrawerShell } from "./_components/work-detail-drawer-shell";

interface WorkDetailPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getAllWorkItemSlugs();
	return slugs.map((slug) => ({ slug }));
}

// Note: `dynamicParams` route segment config is incompatible with Cache
// Components. Unknown slugs render on demand inside the `"use cache"`
// boundary by default; the Sanity webhook revalidates the `workItems` tag
// to keep content fresh.

export async function generateMetadata({
	params,
}: WorkDetailPageProps): Promise<Metadata> {
	cachePageLife();
	const { slug } = await params;
	const work = await getWorkItemBySlug(slug);
	if (!work) return {};
	const description = work.excerpt
		? toPlainText(work.excerpt)
		: work.description;
	return {
		title: `${work.title} · Karthik`,
		description,
		alternates: { canonical: `/work/${work.slug}` },
		openGraph: {
			title: work.title,
			description,
			type: "article",
			images: work.heroImage ? [work.heroImage] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: work.title,
			description,
			images: work.heroImage ? [work.heroImage] : undefined,
		},
	};
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
	cachePageLife();
	const { slug } = await params;
	const work = await getWorkItemBySlug(slug);
	if (!work) notFound();

	const description = work.excerpt
		? toPlainText(work.excerpt)
		: work.description;
	const creativeWorkJsonLd = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: work.title,
		description,
		image: work.heroImage || undefined,
		url: `https://imkarthik.in/work/${work.slug}`,
		author: {
			"@type": "Person",
			name: "Karthik Panchala",
		},
	};

	// Per-route warm light palette lives in globals.css under
	// `[data-theme="work-detail"]`. Every descendant token (background,
	// foreground, card, border, muted-foreground) flips to the Figma values.
	return (
		<div
			data-theme="work-detail"
			className="min-h-dvh bg-background text-foreground"
		>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(creativeWorkJsonLd).replace(
						/</g,
						"\\u003c",
					),
				}}
			/>
			<WorkDetailDrawerShell work={work} />
		</div>
	);
}

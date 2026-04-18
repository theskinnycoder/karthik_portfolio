"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachePageLife } from "@/lib/caching";
import { getAllWorkItemSlugs, getWorkItemBySlug } from "@/sanity/lib/dal";
import { WorkArticle } from "./_components/work-article";

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
	const { slug } = await params;
	const work = await getWorkItemBySlug(slug);
	if (!work) return {};
	const description = work.excerpt ?? work.description;
	return {
		title: `${work.title} · Karthik`,
		description,
		openGraph: {
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

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-16 pb-24">
			<WorkArticle work={work} />
		</main>
	);
}

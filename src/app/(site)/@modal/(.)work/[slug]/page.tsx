"use cache";

import { notFound } from "next/navigation";
import { cachePageLife } from "@/lib/caching";
import { getWorkItemBySlug } from "@/sanity/lib/dal";
import { WorkModalDrawer } from "./_components/work-modal-drawer";

interface WorkModalPageProps {
	params: Promise<{ slug: string }>;
}

export default async function WorkModalPage({ params }: WorkModalPageProps) {
	cachePageLife();
	const { slug } = await params;
	const work = await getWorkItemBySlug(slug);
	if (!work) notFound();
	return <WorkModalDrawer work={work} />;
}

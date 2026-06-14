"use cache";

import { notFound } from "next/navigation";
import { cachePageLife } from "@/lib/caching";
import { getHighlightBySlug } from "@/sanity/lib/dal";
import { ProudMomentModalDrawer } from "./_components/proud-moment-modal-drawer";

interface ProudMomentModalPageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProudMomentModalPage({
	params,
}: ProudMomentModalPageProps) {
	cachePageLife();
	const { slug } = await params;
	const highlight = await getHighlightBySlug(slug);
	if (!highlight) notFound();
	return (
		<ProudMomentModalDrawer
			key={highlight.slug}
			highlight={highlight}
		/>
	);
}

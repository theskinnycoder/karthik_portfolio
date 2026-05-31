import { notFound } from "next/navigation";
import { getWorkItemBySlug } from "@/sanity/lib/dal";
import { WorkModalDrawer } from "./_components/work-modal-drawer";

interface WorkModalPageProps {
	params: Promise<{ slug: string }>;
}

export default async function WorkModalPage({ params }: WorkModalPageProps) {
	const { slug } = await params;
	const work = await getWorkItemBySlug(slug);
	if (!work) notFound();
	return <WorkModalDrawer work={work} />;
}

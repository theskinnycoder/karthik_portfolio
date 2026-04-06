import { Suspense } from "react";

export default async function WorkDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	return (
		<Suspense>
			<WorkDetailContent params={params} />
		</Suspense>
	);
}

async function WorkDetailContent({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 pt-16 pb-24">
			<div className="flex flex-col items-center justify-center gap-2 py-24">
				<h1 className="text-4xl font-bold">Case Study</h1>
				<p className="text-xl text-muted-foreground">Coming soon: {slug}</p>
			</div>
		</main>
	);
}

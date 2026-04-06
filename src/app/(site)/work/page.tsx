"use cache";

import { cachePageLife } from "@/lib/caching";
import { WorkSection } from "./_components/work-section";

export default async function WorkPage() {
	cachePageLife();

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-6 pt-16 pb-24">
			<WorkSection />
		</main>
	);
}

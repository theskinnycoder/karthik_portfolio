"use client";

import { useEffect } from "react";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import type { WorkItemDetailDTO } from "@/sanity/lib/dal";
import { WorkArticle } from "./work-article";

// On a direct page load (bookmark, reload, shared URL), the browser restores
// window.scrollY from the previous visit. Reset to top before first paint.
export function WorkDetailDrawerShell({ work }: { work: WorkItemDetailDTO }) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<DrawerBackHeader href="/work" />
			<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem] md:pt-12">
				<WorkArticle work={work} />
			</main>
		</>
	);
}

"use client";

import { useEffect } from "react";
import { DrawerBackHeader } from "@/components/drawer-back-header";
import type { HighlightDetailDTO } from "@/sanity/lib/dal";
import { ProudMomentArticle } from "./proud-moment-article";

// On a direct page load (bookmark, reload, shared URL), the browser restores
// window.scrollY from the previous visit. Reset to top before first paint.
export function ProudMomentDetailDrawerShell({
	highlight,
}: {
	highlight: HighlightDetailDTO;
}) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<DrawerBackHeader
				href="/proud-moments"
				label="Back to Proud Moment(s)"
			/>
			<main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pt-10 pb-[0.5rem] md:pt-12">
				<ProudMomentArticle highlight={highlight} />
			</main>
		</>
	);
}

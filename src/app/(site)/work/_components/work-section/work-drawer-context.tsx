"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { WorkDetailDrawer } from "./work-drawer";

type WorkDrawerContextValue = {
	openDrawer: (slug: string) => void;
};

const WorkDrawerContext = createContext<WorkDrawerContextValue | null>(null);

export function WorkDrawerProvider({ children }: { children: ReactNode }) {
	const [slug, setSlug] = useState<string | null>(null);

	return (
		<WorkDrawerContext.Provider value={{ openDrawer: setSlug }}>
			{children}
			<WorkDetailDrawer
				slug={slug}
				onClose={() => setSlug(null)}
				onNavigate={setSlug}
			/>
		</WorkDrawerContext.Provider>
	);
}

export function useWorkDrawer(): WorkDrawerContextValue {
	const ctx = useContext(WorkDrawerContext);
	if (!ctx) throw new Error("useWorkDrawer must be inside WorkDrawerProvider");
	return ctx;
}

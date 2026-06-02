// Set before navigating to a work detail page so WorkModalDrawer can suppress
// its open animation regardless of whether WorkDrawerLoading ever mounts.
// (On production, fast cache responses cause React to skip the Suspense fallback
// entirely, so the signal must originate from the click handler, not the loader.)
const KEY = "work-drawer-signal";

export function setWorkDrawerSignal(): void {
	if (typeof window !== "undefined") {
		sessionStorage.setItem(KEY, "1");
	}
}

export function consumeWorkDrawerSignal(): boolean {
	if (typeof window === "undefined") return false;
	const was = !!sessionStorage.getItem(KEY);
	if (was) sessionStorage.removeItem(KEY);
	return was;
}

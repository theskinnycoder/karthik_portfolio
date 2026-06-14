// Set before navigating to a proud-moment detail page so the modal drawer can
// suppress its open animation regardless of whether the loading skeleton ever
// mounts. (On production, fast cache responses cause React to skip the Suspense
// fallback entirely, so the signal must originate from the click handler.)
// Kept separate from the work drawer signal so the two drawers never interfere.
const KEY = "proud-moment-drawer-signal";

export function setProudMomentDrawerSignal(): void {
	if (typeof window !== "undefined") {
		sessionStorage.setItem(KEY, "1");
	}
}

export function consumeProudMomentDrawerSignal(): boolean {
	if (typeof window === "undefined") return false;
	const was = !!sessionStorage.getItem(KEY);
	if (was) sessionStorage.removeItem(KEY);
	return was;
}

import { createPortal } from "react-dom";
import { FONT_SCRIPT_DECORATOR, WEIGHT_DECORATORS } from "./constants";

const HIDDEN_KEYS = [...WEIGHT_DECORATORS, FONT_SCRIPT_DECORATOR] as const;

const HIDE_RULE_ID = "case-study-content-hide-actions";

const HIDE_CSS = `${HIDDEN_KEYS.map(
	(k) => `[data-testid="action-button-${k}"]`,
).join(",\n")} { display: none !important; }`;

/**
 * Hides toolbar buttons that should only be reachable from our custom UI:
 * - Weight decorators       → bubble menu
 * - Font-script decorator   → font-family dropdown
 *
 * Sanity tags each toolbar action `data-testid="action-button-<key>"`, so a
 * single `display: none` rule per key keeps them out of the toolbar without
 * touching the underlying marks.
 */
export function ToolbarStyleScope() {
	const host = typeof document !== "undefined" ? document.head : null;
	if (!host) return null;
	return createPortal(
		<style data-source={HIDE_RULE_ID}>{HIDE_CSS}</style>,
		host,
	);
}

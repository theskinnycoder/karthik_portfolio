import { defineArrayMember } from "sanity";
import {
	FONT_SCRIPT_DECORATOR,
	FontScriptDecorator,
	FontScriptIcon,
	WEIGHT_DECORATORS,
	WEIGHT_TITLES,
	weightDecoratorIcons,
	weightDecoratorRenderers,
} from "../components/case-study-content";
import { COLOR_DECORATORS, COLOR_TITLES } from "./constants";
import {
	colorDecoratorIcons,
	colorDecoratorRenderers,
} from "./decorator-components";

/**
 * Block factory for short rich-text fields (descriptions, excerpts, quotes,
 * bios). Single normal paragraph style, no lists, no embedded objects. Inline
 * marks include weight (300–700), color (foreground/paragraph/muted/accent),
 * and the Caveat font script — composable per-span via the editor toolbar.
 *
 * Use `inlineBlock()` directly inside a field's `of: [...]` array.
 */
export function inlineBlock() {
	return defineArrayMember({
		type: "block",
		styles: [{ title: "Normal", value: "normal" }],
		lists: [],
		marks: {
			decorators: [
				{ title: "Italic", value: "em" },
				{ title: "Strike", value: "s" },
				{ title: "Underline", value: "underline" },
				...WEIGHT_DECORATORS.map((w) => ({
					title: WEIGHT_TITLES[w],
					value: w,
					icon: weightDecoratorIcons[w],
					component: weightDecoratorRenderers[w],
				})),
				...COLOR_DECORATORS.map((c) => ({
					title: COLOR_TITLES[c],
					value: c,
					icon: colorDecoratorIcons[c],
					component: colorDecoratorRenderers[c],
				})),
				{
					title: "Caveat (script)",
					value: FONT_SCRIPT_DECORATOR,
					icon: FontScriptIcon,
					component: FontScriptDecorator,
				},
			],
			annotations: [],
		},
	});
}

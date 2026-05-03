import { defineArrayMember, defineField } from "sanity";
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
 * Block factory for full case-study content. Includes block styles
 * (h1–h6, blockquote, normal), three list variants (bullet, number, check),
 * and a `link` annotation. Inline decorators match `inlineBlock()` so the
 * same toolbar UX applies in both surfaces.
 */
export function articleBlock() {
	return defineArrayMember({
		type: "block",
		styles: [
			{ title: "Normal", value: "normal" },
			{ title: "Heading 1", value: "h1" },
			{ title: "Heading 2", value: "h2" },
			{ title: "Heading 3", value: "h3" },
			{ title: "Heading 4", value: "h4" },
			{ title: "Heading 5", value: "h5" },
			{ title: "Heading 6", value: "h6" },
			{ title: "Quote", value: "blockquote" },
		],
		lists: [
			{ title: "Bullet", value: "bullet" },
			{ title: "Numbered", value: "number" },
			{ title: "Checkmark", value: "check" },
		],
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
			annotations: [
				{
					name: "link",
					type: "object",
					title: "Link",
					fields: [
						defineField({
							name: "href",
							title: "URL",
							type: "url",
							validation: (rule) =>
								rule.required().uri({
									scheme: ["http", "https", "mailto", "tel"],
								}),
						}),
						defineField({
							name: "openInNewTab",
							title: "Open in new tab",
							type: "boolean",
							initialValue: false,
						}),
					],
				},
			],
		},
	});
}

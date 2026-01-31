import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const social = defineType({
	name: "social",
	title: "Social Link",
	type: "document",
	icon: LinkIcon,
	fields: [
		defineField({
			name: "label",
			title: "Label",
			type: "string",
			description: 'Display name (e.g., "LinkedIn", "Gmail")',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "href",
			title: "URL",
			type: "url",
			description: "Link URL (supports mailto: for email)",
			validation: (rule) =>
				rule.required().uri({ scheme: ["http", "https", "mailto"] }),
		}),
		defineField({
			name: "icon",
			title: "Icon",
			type: "image",
			description: "SVG icon for the social link",
			options: { accept: "image/svg+xml" },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "order",
			title: "Display Order",
			type: "number",
			description: "Lower numbers appear first",
			initialValue: 0,
		}),
	],
	preview: {
		select: {
			title: "label",
			media: "icon",
		},
	},
});

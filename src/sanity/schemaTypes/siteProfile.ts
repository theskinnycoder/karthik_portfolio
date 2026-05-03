import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { inlineBlock } from "../rich-text";

export const siteProfile = defineType({
	name: "siteProfile",
	title: "Site Profile",
	type: "document",
	icon: UserIcon,
	fields: [
		defineField({
			name: "name",
			title: "Full Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			title: "Professional Title",
			type: "string",
			description: 'e.g., "Product Designer"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "bio",
			title: "Biography",
			type: "array",
			of: [inlineBlock()],
			description:
				"Rich text bio. Use the colorForeground decorator to highlight phrases against the dimmed paragraph color.",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { title: "name", subtitle: "title" },
	},
});

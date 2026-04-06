import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const workItem = defineType({
	name: "workItem",
	title: "Work Item",
	type: "document",
	icon: ComposeIcon,
	fields: [
		defineField({
			name: "company",
			title: "Company",
			type: "reference",
			to: [{ type: "company" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "icon",
			title: "Icon",
			type: "cloudinary.asset",
			description: "Optional icon displayed next to the title",
		}),
		defineField({
			name: "tag",
			title: "Tag",
			type: "string",
			description: 'Chip text (e.g. "Experience", "New Feature Request")',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "cloudinary.asset",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "string",
			description: "One-line summary shown on the card",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "title" },
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
			title: "title",
			subtitle: "tag",
		},
	},
});

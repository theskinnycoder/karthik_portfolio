import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { inlineBlock } from "../rich-text";

export const testimonial = defineType({
	name: "testimonial",
	title: "Testimonial",
	type: "document",
	icon: StarIcon,
	fields: [
		defineField({
			name: "quote",
			title: "Quote",
			type: "array",
			of: [inlineBlock()],
			description:
				"Quote body. Use the colorForeground decorator to highlight emphasized phrases.",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "authorName",
			title: "Author Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "authorRole",
			title: "Author Role",
			type: "string",
			description: 'e.g. "Senior Product Manager"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "company",
			title: "Company",
			type: "reference",
			to: [{ type: "company" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "authorAvatar",
			title: "Author Avatar",
			type: "cloudinary.asset",
			description: "Author's profile photo",
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
			title: "authorName",
			subtitle: "company.name",
		},
	},
});

import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const project = defineType({
	name: "project",
	title: "Project",
	type: "document",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "name",
			title: "Project Name",
			type: "string",
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
			description: "Accessibility description for the image",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "url",
			title: "Project URL",
			type: "url",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "backgroundColor",
			title: "Background Color",
			type: "string",
			description: "Hex color code (e.g., #979797)",
			validation: (rule) =>
				rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
					name: "hex color",
					invert: false,
				}),
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
			title: "name",
		},
	},
});

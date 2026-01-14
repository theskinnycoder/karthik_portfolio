import { CaseIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const company = defineType({
	name: "company",
	title: "Company",
	type: "document",
	icon: CaseIcon,
	fields: [
		defineField({
			name: "name",
			title: "Company Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			description: "Company logo (preferably SVG or PNG with transparency)",
			options: {
				accept: "image/svg+xml,image/png,image/webp",
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "website",
			title: "Website",
			type: "url",
			description: "Company website URL",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 2,
			description: "Brief description of the company",
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
			media: "logo",
		},
	},
});

import { CaseIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const experience = defineType({
	name: "experience",
	title: "Experience",
	type: "document",
	icon: CaseIcon,
	fields: [
		defineField({
			name: "company",
			title: "Company Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "url",
			title: "Company URL",
			type: "url",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
			description: 'Job title (e.g., "Product Designer")',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "string",
			description: "Date range or additional context",
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
			title: "company",
			subtitle: "role",
		},
	},
});

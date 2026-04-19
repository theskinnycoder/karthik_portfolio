import { CaseIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { fontWeightDecorators } from "./portableTextMarks";

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
			type: "cloudinary.asset",
			description: "Company logo (preferably SVG or PNG with transparency)",
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
			name: "isCurrent",
			title: "Currently Working Here",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "workTagline",
			title: "Work Tagline",
			type: "string",
			description:
				'Tagline shown on the work page (e.g. "World\'s 1st Nudging Platform...")',
		}),
		defineField({
			name: "workDescription",
			title: "Work Description",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
							{ title: "Underline", value: "underline" },
							{ title: "Strike", value: "strike-through" },
							...fontWeightDecorators,
						],
					},
				}),
			],
			description:
				"Description shown on the work page (bold text renders as white highlighted text)",
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

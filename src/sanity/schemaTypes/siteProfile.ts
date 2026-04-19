import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { fontWeightDecorators } from "./portableTextMarks";

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
			description: "Rich text bio - use bold for highlighted text",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { title: "name", subtitle: "title" },
	},
});

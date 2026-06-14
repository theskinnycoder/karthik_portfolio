import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { caseStudyContentField } from "./shared/case-study-content";

export const highlight = defineType({
	name: "highlight",
	title: "Proud Moment",
	type: "document",
	icon: StarIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
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
			name: "date",
			title: "Date",
			type: "date",
			description:
				"Optional. Drives the card date pill and newest-first ordering when set.",
			options: { dateFormat: "MMM YYYY" },
		}),
		defineField({
			name: "image",
			title: "Image",
			type: "cloudinary.asset",
			description:
				"Shown as the card thumbnail and the hero image on the detail page",
			validation: (rule) => rule.required(),
		}),
		caseStudyContentField(),
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
			description:
				"Manual override. Lower numbers appear first within the same date.",
			initialValue: 0,
		}),
	],
	orderings: [
		{
			title: "Date, Newest",
			name: "dateDesc",
			by: [
				{ field: "date", direction: "desc" },
				{ field: "order", direction: "asc" },
			],
		},
	],
	preview: {
		select: {
			title: "title",
			subtitle: "date",
			media: "image",
		},
	},
});

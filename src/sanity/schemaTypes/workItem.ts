import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { inlineBlock } from "../rich-text";
import { caseStudyContentField } from "./shared/case-study-content";

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
			title: "Card Image",
			type: "cloudinary.asset",
			description: "Image shown on the work list card",
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
			name: "heroImage",
			title: "Hero Image",
			type: "cloudinary.asset",
			description: "Large image shown at the top of the case-study page",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "excerpt",
			title: "Excerpt",
			type: "array",
			of: [inlineBlock()],
			description:
				"Short lede shown under the title on the case-study page (falls back to description if empty). Use the colorForeground decorator to highlight phrases against the dimmed paragraph color.",
		}),
		defineField({
			name: "brand",
			title: "Brand colors",
			type: "object",
			description:
				"Optional per-work brand palette. Drives the case-study border accent and the work-card CTA gradient. Leave blank for the site default.",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "primary",
					title: "Primary",
					type: "string",
					description:
						"Hex, e.g. #2563EB. Card CTA gradient start (and case-study accent).",
				}),
				defineField({
					name: "secondary",
					title: "Secondary",
					type: "string",
					description:
						"Hex. Card CTA gradient end. Leave blank for a solid swatch using primary.",
				}),
				defineField({
					name: "accent",
					title: "Accent",
					type: "string",
					description: "Hex",
				}),
				defineField({
					name: "muted",
					title: "Muted background",
					type: "string",
					description: "Hex, subtle fill",
				}),
				defineField({
					name: "icon",
					title: "CTA icon color",
					type: "string",
					description:
						"Hex. Color of the arrow icon on the card CTA button. Defaults to black (#000000).",
				}),
			],
		}),
		defineField({
			name: "liveUrl",
			title: "Live URL",
			type: "url",
			description: "Optional link to the shipped product",
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
			description: "Lower numbers appear first",
			initialValue: 0,
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "tag",
			media: "heroImage",
		},
	},
});

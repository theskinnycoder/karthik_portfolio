import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const sectionHeader = defineType({
	name: "sectionHeader",
	title: "Section Header",
	type: "document",
	icon: BlockContentIcon,
	fields: [
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			description:
				"Unique identifier (e.g., other-works, testimonials, experience)",
			options: { source: "title" },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			title: "Internal Title",
			type: "string",
			description: "For Studio organization only",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "headingPrefix",
			title: "Heading Prefix",
			type: "string",
			description: 'Plain text before highlight (e.g., "How I design with my")',
		}),
		defineField({
			name: "headingHighlight",
			title: "Highlighted Text",
			type: "string",
			description: 'Gradient/emphasized text (e.g., "Overthinking!!")',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "headingEmoji",
			title: "Emoji/Icon",
			type: "string",
			description: 'Optional emoji (e.g., "👀")',
		}),
		defineField({
			name: "icon",
			title: "Icon Image",
			type: "cloudinary.asset",
			description: "Optional icon image (alternative to emoji)",
		}),
		defineField({
			name: "gradientFrom",
			title: "Gradient From",
			type: "string",
			description: "Hex color for gradient start (e.g., #FBBA27)",
		}),
		defineField({
			name: "gradientTo",
			title: "Gradient To",
			type: "string",
			description: "Hex color for gradient end (e.g., #FB7481)",
		}),
		defineField({
			name: "video",
			title: "Video",
			type: "cloudinary.asset",
			description: "Optional video for this section",
		}),
		defineField({
			name: "subheading",
			title: "Subheading",
			type: "string",
			description: "Optional text below main heading",
		}),
	],
	preview: {
		select: { title: "title", subtitle: "slug.current" },
	},
});

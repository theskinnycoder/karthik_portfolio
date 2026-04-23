import { ComposeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

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
			type: "text",
			rows: 3,
			description:
				"Short lede shown under the title on the case-study page (falls back to description if empty)",
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "string",
			description: 'e.g. "Product Designer", "Design Lead"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "year",
			title: "Year",
			type: "string",
			description: 'e.g. "2024" or "2023—present"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "duration",
			title: "Duration",
			type: "string",
			description: 'Optional time spent, e.g. "3 months"',
		}),
		defineField({
			name: "stack",
			title: "Stack / Tools",
			type: "array",
			of: [{ type: "string" }],
			options: { layout: "tags" },
			description: "Tools, methods, or technologies used on the project",
		}),
		defineField({
			name: "team",
			title: "Team",
			type: "array",
			description: "People on the project (shown in meta panel)",
			of: [
				defineArrayMember({
					type: "object",
					name: "teamMember",
					fields: [
						defineField({
							name: "name",
							title: "Name",
							type: "string",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "role",
							title: "Role",
							type: "string",
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: { title: "name", subtitle: "role" },
					},
				}),
			],
		}),
		defineField({
			name: "brand",
			title: "Brand colors",
			type: "object",
			description:
				"Optional per-case-study brand palette. Leave blank to use the site default.",
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({
					name: "primary",
					title: "Primary",
					type: "string",
					description: "Hex, e.g. #2563EB",
				}),
				defineField({
					name: "secondary",
					title: "Secondary",
					type: "string",
					description: "Hex",
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
			],
		}),
		defineField({
			name: "liveUrl",
			title: "Live URL",
			type: "url",
			description: "Optional link to the shipped product",
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			description: "Rich-text body for the case study",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "Heading 1", value: "h1" },
						{ title: "Heading 2", value: "h2" },
						{ title: "Heading 3", value: "h3" },
						{ title: "Heading 4", value: "h4" },
						{ title: "Heading 5", value: "h5" },
						{ title: "Heading 6", value: "h6" },
						{ title: "Quote", value: "blockquote" },
					],
					lists: [
						{ title: "Bullet", value: "bullet" },
						{ title: "Numbered", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
							{ title: "Code", value: "code" },
						],
						annotations: [
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									defineField({
										name: "href",
										title: "URL",
										type: "url",
										validation: (rule) =>
											rule.required().uri({
												scheme: ["http", "https", "mailto", "tel"],
											}),
									}),
									defineField({
										name: "openInNewTab",
										title: "Open in new tab",
										type: "boolean",
										initialValue: false,
									}),
								],
							},
						],
					},
				}),
				defineArrayMember({
					type: "object",
					name: "contentImage",
					title: "Image",
					fields: [
						defineField({
							name: "asset",
							title: "Image",
							type: "cloudinary.asset",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "alt",
							title: "Alt text",
							type: "string",
							description: "Required for accessibility and SEO",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "caption",
							title: "Caption",
							type: "string",
							description: "Optional caption displayed below the image",
						}),
						defineField({
							name: "size",
							title: "Size",
							type: "string",
							options: {
								list: [
									{ title: "Inline", value: "inline" },
									{ title: "Wide", value: "wide" },
									{ title: "Full-bleed", value: "full" },
								],
								layout: "radio",
							},
							initialValue: "inline",
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: {
							title: "alt",
							subtitle: "caption",
							media: "asset",
						},
					},
				}),
				defineArrayMember({
					type: "object",
					name: "contentTestimonial",
					title: "Testimonial",
					fields: [
						defineField({
							name: "testimonial",
							title: "Testimonial",
							type: "reference",
							to: [{ type: "testimonial" }],
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: {
							author: "testimonial.authorName",
							quote: "testimonial.quote",
						},
						prepare: ({ author, quote }) => ({
							title: (author as string) || "Testimonial",
							subtitle: quote as string,
						}),
					},
				}),
				defineArrayMember({
					type: "object",
					name: "contentCode",
					title: "Code block",
					fields: [
						defineField({
							name: "language",
							title: "Language",
							type: "string",
							options: {
								list: [
									{ title: "TypeScript", value: "typescript" },
									{ title: "JavaScript", value: "javascript" },
									{ title: "TSX", value: "tsx" },
									{ title: "JSX", value: "jsx" },
									{ title: "CSS", value: "css" },
									{ title: "HTML", value: "html" },
									{ title: "JSON", value: "json" },
									{ title: "Markdown", value: "markdown" },
									{ title: "Bash", value: "bash" },
									{ title: "Python", value: "python" },
									{ title: "GROQ", value: "groq" },
									{ title: "Plain text", value: "text" },
								],
							},
							initialValue: "text",
						}),
						defineField({
							name: "filename",
							title: "Filename",
							type: "string",
							description: "Optional label shown above the code",
						}),
						defineField({
							name: "code",
							title: "Code",
							type: "text",
							rows: 10,
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: { title: "filename", subtitle: "language", code: "code" },
						prepare: ({ title, subtitle, code }) => ({
							title: (title as string) || (subtitle as string) || "Code",
							subtitle:
								typeof code === "string"
									? code.split("\n")[0].slice(0, 80)
									: undefined,
						}),
					},
				}),
				defineArrayMember({
					type: "object",
					name: "contentDivider",
					title: "Divider",
					fields: [
						defineField({
							name: "style",
							title: "Style",
							type: "string",
							options: {
								list: [
									{ title: "Line", value: "line" },
									{ title: "Space", value: "space" },
								],
								layout: "radio",
							},
							initialValue: "line",
							validation: (rule) => rule.required(),
						}),
					],
					preview: {
						select: { style: "style" },
						prepare: ({ style }) => ({
							title: "Divider",
							subtitle: style as string,
						}),
					},
				}),
				defineArrayMember({
					type: "object",
					name: "contentVideo",
					title: "Video",
					fields: [
						defineField({
							name: "asset",
							title: "Video",
							type: "cloudinary.asset",
							validation: (rule) => rule.required(),
						}),
						defineField({
							name: "caption",
							title: "Caption",
							type: "string",
						}),
						defineField({
							name: "autoplay",
							title: "Autoplay",
							type: "boolean",
							description:
								"Auto-plays on load. Requires muted to be enabled in browsers.",
							initialValue: false,
						}),
						defineField({
							name: "loop",
							title: "Loop",
							type: "boolean",
							initialValue: false,
						}),
						defineField({
							name: "muted",
							title: "Muted",
							type: "boolean",
							description: "Start muted. Required when autoplay is on.",
							initialValue: true,
						}),
						defineField({
							name: "controls",
							title: "Show controls",
							type: "boolean",
							initialValue: true,
						}),
					],
					preview: {
						select: { title: "caption", media: "asset" },
						prepare: ({ title, media }) => ({
							title: (title as string) || "Video",
							media: media as unknown as undefined,
						}),
					},
				}),
			],
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
			media: "heroImage",
		},
	},
});

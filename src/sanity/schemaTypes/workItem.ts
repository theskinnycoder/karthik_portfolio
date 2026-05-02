import { ComposeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
	CaseStudyContentPlugins,
	FONT_SCRIPT_DECORATOR,
	FontScriptDecorator,
	FontScriptIcon,
	WEIGHT_DECORATORS,
	WEIGHT_TITLES,
	weightDecoratorIcons,
	weightDecoratorRenderers,
} from "../components/case-study-content";

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
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
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
						{ title: "Checkmark", value: "check" },
					],
					marks: {
						decorators: [
							{ title: "Italic", value: "em" },
							{ title: "Strike", value: "s" },
							{ title: "Underline", value: "underline" },
							...WEIGHT_DECORATORS.map((w) => ({
								title: WEIGHT_TITLES[w],
								value: w,
								icon: weightDecoratorIcons[w],
								component: weightDecoratorRenderers[w],
							})),
							{
								title: "Caveat (script)",
								value: FONT_SCRIPT_DECORATOR,
								icon: FontScriptIcon,
								component: FontScriptDecorator,
							},
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
					name: "contentMeta",
					title: "Meta panel",
					fields: [
						defineField({
							name: "role",
							title: "My Work",
							type: "string",
							description:
								'e.g. "Product Research, User Flow, UX, High Fidelity"',
						}),
						defineField({
							name: "team",
							title: "Team",
							type: "array",
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
										defineField({
											name: "avatar",
											title: "Avatar",
											type: "cloudinary.asset",
										}),
									],
									preview: {
										select: {
											title: "name",
											subtitle: "role",
											media: "avatar",
										},
									},
								}),
							],
						}),
						defineField({
							name: "timeline",
							title: "Time Line",
							type: "string",
							description: 'e.g. "2 Weeks · August 2023"',
						}),
						defineField({
							name: "tools",
							title: "Tools",
							type: "array",
							of: [{ type: "string" }],
							options: { layout: "tags" },
						}),
					],
					preview: {
						select: { role: "role", timeline: "timeline" },
						prepare: ({ role, timeline }) => {
							const parts = [role, timeline].filter(
								(p): p is string => typeof p === "string" && p.length > 0,
							);
							return {
								title: "Meta panel",
								subtitle: parts.length > 0 ? parts.join(" · ") : undefined,
							};
						},
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

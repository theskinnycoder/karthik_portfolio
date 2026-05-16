import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { CaseStudyContentPlugins } from "../components/case-study-content";
import { articleBlock } from "../rich-text";

export const siteProfile = defineType({
	name: "siteProfile",
	title: "Site Profile",
	type: "document",
	icon: UserIcon,
	fields: [
		defineField({
			name: "name",
			title: "Full Name",
			type: "array",
			of: [articleBlock()],
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "title",
			title: "Professional Title",
			type: "array",
			of: [articleBlock()],
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
			description: 'e.g., "Product Designer"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "availabilityMessage",
			title: "Availability Message",
			type: "string",
			description: 'e.g., "I\'m currently available for new opportunities"',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "bio",
			title: "Biography",
			type: "array",
			of: [articleBlock()],
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
			description:
				"Rich text bio. Supports headings, lists, and links. Use color decorators to highlight phrases.",
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { name: "name", title: "title" },
		prepare({ name, title }: Record<string, unknown>) {
			const pt = (v: unknown) =>
				Array.isArray(v)
					? v
							.map((b: { children?: { text?: string }[] }) =>
								(b.children ?? []).map((s) => s.text ?? "").join(""),
							)
							.join(" ")
					: String(v ?? "");
			return { title: pt(name) || "—", subtitle: pt(title) || undefined };
		},
	},
});

import { CaseIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { CaseStudyContentPlugins } from "../components/case-study-content";
import { articleBlock } from "../rich-text";

export const experience = defineType({
	name: "experience",
	title: "Experience",
	type: "document",
	icon: CaseIcon,
	fields: [
		defineField({
			name: "company",
			title: "Company Name",
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
			name: "url",
			title: "Company URL",
			type: "url",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role",
			type: "array",
			of: [articleBlock()],
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
			description: 'Job title (e.g., "Product Designer")',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "array",
			of: [articleBlock()],
			components: {
				portableText: {
					plugins: CaseStudyContentPlugins,
				},
			},
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
			company: "company",
			role: "role",
		},
		prepare({ company, role }: Record<string, unknown>) {
			const pt = (v: unknown) =>
				Array.isArray(v)
					? v
							.map((b: { children?: { text?: string }[] }) =>
								(b.children ?? []).map((s) => s.text ?? "").join(""),
							)
							.join(" ")
					: String(v ?? "");
			return { title: pt(company) || "—", subtitle: pt(role) || undefined };
		},
	},
});

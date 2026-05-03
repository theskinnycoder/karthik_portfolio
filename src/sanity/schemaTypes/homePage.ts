import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const HOME_SECTION_KEYS = [
	"intro",
	"experience",
	"otherWorks",
	"testimonials",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

const HOME_SECTION_OPTIONS: { title: string; value: HomeSectionKey }[] = [
	{ title: "Intro", value: "intro" },
	{ title: "Experience", value: "experience" },
	{ title: "Other Works", value: "otherWorks" },
	{ title: "Testimonials", value: "testimonials" },
];

export const homePage = defineType({
	name: "homePage",
	title: "Home Page",
	type: "document",
	icon: HomeIcon,
	fields: [
		defineField({
			name: "sections",
			title: "Section order",
			description:
				"Drag to reorder. The Video Hero is always pinned at the top and is not listed here.",
			type: "array",
			of: [
				defineArrayMember({
					type: "string",
					options: { list: HOME_SECTION_OPTIONS },
				}),
			],
			options: { layout: "tags" },
			validation: (rule) =>
				rule
					.required()
					.min(1)
					.unique()
					.custom((value) => {
						if (!Array.isArray(value)) return true;
						const allowed = new Set<string>(HOME_SECTION_KEYS);
						const invalid = value.filter(
							(v): v is string => typeof v === "string" && !allowed.has(v),
						);
						if (invalid.length > 0) {
							return `Unknown section(s): ${invalid.join(", ")}`;
						}
						return true;
					}),
		}),
	],
	preview: {
		prepare: () => ({ title: "Home Page" }),
	},
});

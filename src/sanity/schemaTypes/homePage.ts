import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { SectionOrderInput } from "../components/section-order-input";
import { HOME_SECTION_KEYS, type HomeSectionKey } from "../lib/home-sections";

export { HOME_SECTION_KEYS, type HomeSectionKey };

export const homePage = defineType({
	name: "homePage",
	title: "Home Page",
	type: "document",
	icon: HomeIcon,
	fields: [
		defineField({
			name: "sections",
			title: "Section order",
			description: "Drag rows to reorder. All sections are always included.",
			type: "array",
			of: [{ type: "string" }],
			components: { input: SectionOrderInput },
			validation: (rule) => rule.required().min(1).unique(),
		}),
	],
	preview: {
		prepare: () => ({ title: "Home Page" }),
	},
});

import { type SchemaPluginOptions, type SchemaTypeDefinition } from "sanity";
import { company } from "./company";
import { experience } from "./experience";
import { homePage } from "./homePage";
import { project } from "./project";
import { sectionHeader } from "./sectionHeader";
import { siteProfile } from "./siteProfile";
import { social } from "./social";
import { testimonial } from "./testimonial";
import { workItem } from "./workItem";

export const schema = {
	types: [
		company,
		experience,
		homePage,
		project,
		sectionHeader,
		siteProfile,
		social,
		testimonial,
		workItem,
	],
} satisfies
	| SchemaPluginOptions
	| {
			types: SchemaTypeDefinition[];
	  }
	| undefined;

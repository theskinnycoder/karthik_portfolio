import { type SchemaPluginOptions, type SchemaTypeDefinition } from "sanity";
import { company } from "./company";
import { testimonial } from "./testimonial";

export const schema = {
	types: [company, testimonial],
} satisfies
	| SchemaPluginOptions
	| {
			types: SchemaTypeDefinition[];
	  }
	| undefined;

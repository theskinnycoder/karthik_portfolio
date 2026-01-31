import { UserIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteProfile"];

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			// Singleton
			S.listItem()
				.title("Site Profile")
				.icon(UserIcon)
				.child(
					S.document().schemaType("siteProfile").documentId("siteProfile"),
				),
			S.divider(),
			// Collections (excluding singletons)
			...S.documentTypeListItems().filter(
				(listItem) => !SINGLETONS.includes(listItem.getId() as string),
			),
		]);

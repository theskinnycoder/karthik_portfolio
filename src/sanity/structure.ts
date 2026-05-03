import { HomeIcon, UserIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteProfile", "homePage"];

export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			// Singletons
			S.listItem()
				.title("Site Profile")
				.icon(UserIcon)
				.child(
					S.document().schemaType("siteProfile").documentId("siteProfile"),
				),
			S.listItem()
				.title("Home Page")
				.icon(HomeIcon)
				.child(S.document().schemaType("homePage").documentId("homePage")),
			S.divider(),
			// Collections (excluding singletons)
			...S.documentTypeListItems().filter(
				(listItem) => !SINGLETONS.includes(listItem.getId() as string),
			),
		]);

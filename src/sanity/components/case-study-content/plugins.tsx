import { type PortableTextPluginsProps } from "sanity";
import { FontFamilyToolbar } from "./font-family-toolbar";
import { SelectionBubble } from "./selection-bubble";
import { ToolbarStyleScope } from "./toolbar-style";

export function CaseStudyContentPlugins(props: PortableTextPluginsProps) {
	return (
		<>
			{props.renderDefault(props)}
			<ToolbarStyleScope />
			<SelectionBubble />
			<FontFamilyToolbar />
		</>
	);
}

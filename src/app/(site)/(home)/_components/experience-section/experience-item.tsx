import { inlineMarks } from "@/components/portable-text/inline-marks";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import { ArrowUpRight } from "lucide-react";
import { PortableText, type PortableTextBlock } from "next-sanity";

/**
 * Renders PortableText blocks without a wrapping block element.
 * All block styles (normal, h1–h6, blockquote) collapse to a fragment so the
 * text flows inline inside ItemTitle, ItemDescription, and span contexts —
 * no invalid nested block HTML.
 */
const stripBlock = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const inlineBlockComponents = {
	block: {
		normal: stripBlock,
		h1: stripBlock,
		h2: stripBlock,
		h3: stripBlock,
		h4: stripBlock,
		h5: stripBlock,
		h6: stripBlock,
		blockquote: stripBlock,
	},
	marks: inlineMarks,
};

function InlinePortableText({ value }: { value: PortableTextBlock[] }) {
	return (
		<PortableText
			value={value}
			components={inlineBlockComponents}
		/>
	);
}

export interface ExperienceItemProps {
	company: PortableTextBlock[];
	url: string;
	description: PortableTextBlock[];
	role: PortableTextBlock[];
}

export function ExperienceItem({
	company,
	url,
	description,
	role,
}: ExperienceItemProps) {
	return (
		<Item asChild>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				<ItemContent>
					<ItemTitle className="text-base font-semibold text-foreground">
						<InlinePortableText value={company} />
						<ArrowUpRight className="size-4 shrink-0" />
					</ItemTitle>
					<ItemDescription className="text-sm font-light">
						<InlinePortableText value={description} />
					</ItemDescription>
				</ItemContent>
				<ItemActions className="self-start md:self-center">
					<span className="text-sm font-medium text-muted-foreground">
						<InlinePortableText value={role} />
					</span>
				</ItemActions>
			</a>
		</Item>
	);
}

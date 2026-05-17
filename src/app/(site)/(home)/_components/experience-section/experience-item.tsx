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

const stripBlock = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

// Heading levels map to sized spans so Sanity heading choices affect font size.
const sizedBlockComponents = {
	block: {
		normal: stripBlock,
		h1: ({ children }: { children?: React.ReactNode }) => <span className="text-xl leading-snug">{children}</span>,
		h2: ({ children }: { children?: React.ReactNode }) => <span className="text-lg leading-snug">{children}</span>,
		h3: ({ children }: { children?: React.ReactNode }) => <span className="text-base leading-snug">{children}</span>,
		h4: ({ children }: { children?: React.ReactNode }) => <span className="text-sm leading-snug">{children}</span>,
		h5: ({ children }: { children?: React.ReactNode }) => <span className="text-xs leading-snug">{children}</span>,
		h6: stripBlock,
		blockquote: stripBlock,
	},
	marks: inlineMarks,
};

// Description keeps stripBlock — prose where font size changes would be disruptive.
const descriptionBlockComponents = {
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

function SizedPortableText({ value }: { value: PortableTextBlock[] }) {
	return <PortableText value={value} components={sizedBlockComponents} />;
}

function DescriptionPortableText({ value }: { value: PortableTextBlock[] }) {
	return <PortableText value={value} components={descriptionBlockComponents} />;
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
						<SizedPortableText value={company} />
						<ArrowUpRight className="size-4 shrink-0" />
					</ItemTitle>
					<ItemDescription className="text-sm font-light">
						<DescriptionPortableText value={description} />
					</ItemDescription>
				</ItemContent>
				<ItemActions className="self-start md:self-center">
					<span className="text-sm font-medium text-muted-foreground">
						<SizedPortableText value={role} />
					</span>
				</ItemActions>
			</a>
		</Item>
	);
}

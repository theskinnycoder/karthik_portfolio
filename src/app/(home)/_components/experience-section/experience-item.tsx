import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import { ArrowUpRight } from "lucide-react";

export interface ExperienceItemProps {
	company: string;
	url: string;
	description: string;
	role: string;
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
						{company}
						<ArrowUpRight className="size-4" />
					</ItemTitle>
					<ItemDescription className="text-sm font-light">
						{description}
					</ItemDescription>
				</ItemContent>
				<ItemActions className="self-start md:self-center">
					<span className="text-sm font-medium text-muted-foreground">
						{role}
					</span>
				</ItemActions>
			</a>
		</Item>
	);
}

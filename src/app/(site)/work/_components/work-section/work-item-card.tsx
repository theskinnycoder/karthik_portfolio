import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MediaImage } from "@/components/media";
import type { WorkItemDTO } from "@/sanity/lib/dal";

interface WorkItemCardProps {
	item: WorkItemDTO;
}

export function WorkItemCard({ item }: WorkItemCardProps) {
	return (
		<Link href={`/work/${item.slug}`}>
			<div className="flex flex-col gap-3 rounded-[20px] border border-border bg-card p-3.5">
				<div className="flex items-center gap-1.5">
					{item.icon && (
						<MediaImage
							src={item.icon}
							alt=""
							width={16}
							height={16}
							className="size-4"
						/>
					)}
					<span className="text-sm leading-prose font-medium tracking-prose text-foreground">
						{item.title}
					</span>
					<span className="ml-auto rounded-full border border-border bg-card px-3 py-1 text-xs font-light tracking-prose text-foreground">
						{item.tag}
					</span>
				</div>
				<div className="overflow-hidden rounded-xl">
					<MediaImage
						src={item.image}
						alt={item.title}
						width={600}
						height={340}
						className="w-full object-cover"
					/>
				</div>
				<div className="flex items-center gap-2">
					<p className="flex-1 truncate text-sm leading-prose font-light tracking-prose text-muted-foreground">
						{item.description}
					</p>
					<div className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#c8ed97] to-[#47d9b8]">
						<ArrowUpRight className="size-4 text-background" />
					</div>
				</div>
			</div>
		</Link>
	);
}

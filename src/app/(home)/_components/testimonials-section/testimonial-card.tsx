import { MediaImage } from "@/components/media";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TestimonialDTO } from "@/sanity/lib/dal";

export function TestimonialCard({
	quote,
	authorName,
	authorRole,
	authorAvatar,
	company,
}: TestimonialDTO) {
	return (
		<div className="flex flex-col gap-6 rounded-[18px] border border-border p-[18px]">
			<p className="text-base font-light text-muted-foreground">{quote}</p>

			<div className="flex items-center gap-3">
				<Avatar className="size-10">
					<AvatarImage
						src={authorAvatar}
						alt={authorName}
						className="object-top"
					/>
					<AvatarFallback>
						{authorName
							.split(" ")
							.map((n) => n[0])
							.join("")
							.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="text-base font-semibold text-foreground">
						{authorName}
					</span>
					<div className="flex items-center gap-1">
						<span className="text-xs font-light text-muted-foreground">
							{authorRole} at
						</span>
						<MediaImage
							src={company.logo}
							alt={company.name}
							width={0}
							height={0}
							className="h-3.5 w-auto"
							sizes="100vw"
							loading="eager"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

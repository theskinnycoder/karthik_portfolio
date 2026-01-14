import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export interface TestimonialCardProps {
	quote: string;
	author: {
		name: string;
		role: string;
		company: string;
		companyLogo: string;
		avatar: string;
	};
}

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
	return (
		<div className="flex flex-col gap-6 rounded-[18px] border border-border p-[18px]">
			<p className="text-base font-light text-muted-foreground">{quote}</p>

			<div className="flex items-center gap-3">
				<Avatar className="size-10">
					<AvatarImage
						src={author.avatar}
						alt={author.name}
					/>
					<AvatarFallback>
						{author.name
							.split(" ")
							.map((n) => n[0])
							.join("")
							.slice(0, 2)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="text-base font-semibold text-foreground">
						{author.name}
					</span>
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-light text-muted-foreground">
							{author.role}
						</span>
						<Image
							src={author.companyLogo}
							alt={author.company}
							width={1920}
							height={1080}
							className="h-3.5 w-fit"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

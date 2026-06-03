import { MediaImage } from "@/components/media";
import { getSocials } from "@/sanity/lib/dal";

export async function SocialLinks() {
	const socialLinks = await getSocials();

	return (
		<div className="flex flex-wrap gap-2">
			{socialLinks.map((link) => (
				<a
					key={link.label}
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground transition-colors hover:bg-muted md:px-4 md:py-2 md:text-lg"
				>
					<MediaImage
						src={link.icon}
						alt={link.label}
						width={18}
						height={18}
						className="size-[18px] md:size-5"
						loading="eager"
					/>
					<span>{link.label}</span>
				</a>
			))}
		</div>
	);
}

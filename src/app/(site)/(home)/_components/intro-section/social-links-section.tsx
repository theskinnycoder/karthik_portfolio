import { MediaImage } from "@/components/media";
import { getSocials } from "@/sanity/lib/dal";

export async function SocialLinks() {
	const socialLinks = await getSocials();

	return (
		<div className="flex flex-wrap gap-2">
			{socialLinks.map((link) => (
				<div
					key={link.label}
					className="group relative inline-block rounded-full"
				>
					<div
						aria-hidden="true"
						className="absolute inset-px rounded-full bg-ring"
					/>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						className="relative inline-flex origin-left items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-base font-semibold text-foreground transition-transform duration-150 will-change-transform group-hover:-rotate-4 md:px-4 md:py-2 md:text-lg"
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
				</div>
			))}
		</div>
	);
}

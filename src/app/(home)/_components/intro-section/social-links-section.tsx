import { getSocials } from "@/sanity/lib/dal";
import Image from "next/image";

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
					className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-base font-semibold text-foreground transition-colors hover:bg-muted"
				>
					<Image
						src={link.icon}
						alt={link.label}
						width={18}
						height={18}
					/>
					<span>{link.label}</span>
				</a>
			))}
		</div>
	);
}

import Image from "next/image";

interface SocialLink {
	label: string;
	href: string;
	icon: string;
}

const socialLinks = [
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/karthikpanchala",
		icon: "/linkedin-logo.svg",
	},
	{
		label: "Gmail",
		href: "mailto:karthik@example.com",
		icon: "/gmail-logo.svg",
	},
	{
		label: "Dribble",
		href: "https://dribble.com/karthikpanchala",
		icon: "/dribble-logo.svg",
	},
	{
		label: "Behance",
		href: "https://behance.net/karthikpanchala",
		icon: "/behance-logo.svg",
	},
] satisfies SocialLink[];

export function SocialLinks() {
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

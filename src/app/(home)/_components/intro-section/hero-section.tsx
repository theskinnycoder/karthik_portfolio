interface HeroSectionProps {
	name: string;
	title: string;
}

export function HeroSection({ name, title }: HeroSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-4xl font-semibold text-foreground">{name}</h1>
			<p className="text-3xl font-semibold text-muted-foreground">{title}</p>
		</div>
	);
}

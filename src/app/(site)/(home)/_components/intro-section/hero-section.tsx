import SplitText from "@/components/SplitText";

interface HeroSectionProps {
	name: string;
	title: string;
}

export function HeroSection({ name, title }: HeroSectionProps) {
	return (
		<div className="flex flex-col gap-2">
			<SplitText
				text={name}
				tag="h1"
				className="text-4xl font-semibold text-foreground"
				splitType="chars"
				textAlign="left"
			/>
			<SplitText
				text={title}
				tag="p"
				className="text-3xl font-semibold text-muted-foreground"
				splitType="chars"
				textAlign="left"
				startDelay={0.4}
			/>
		</div>
	);
}

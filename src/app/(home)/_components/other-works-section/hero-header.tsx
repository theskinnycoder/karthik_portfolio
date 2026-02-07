import { MediaImage } from "@/components/media";

interface HeroHeaderProps {
	headingPrefix?: string;
	headingHighlight?: string;
	headingEmoji?: string;
	icon?: string;
	videoUrl?: string;
	subheading?: string;
	gradientFrom?: string;
	gradientTo?: string;
}

export function HeroHeader({
	headingPrefix = "How I design with my",
	headingHighlight = "Overthinking!!",
	headingEmoji = "👀",
	icon,
	videoUrl,
	subheading = "Here are some other designs I tinkered around with",
	gradientFrom = "#FBBA27",
	gradientTo = "#FB7481",
}: HeroHeaderProps) {
	const hasVideo = !!videoUrl;

	return (
		<div className="flex flex-col items-center gap-12">
			<div className="flex flex-col items-center gap-12">
				<h2 className="text-center font-serif text-4xl">
					{headingPrefix && (
						<span className="text-muted-foreground">{headingPrefix} </span>
					)}
					<div className="inline-flex items-baseline space-x-2 md:inline">
						<span
							className="bg-clip-text text-transparent"
							style={{
								backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
							}}
						>
							{headingHighlight}{" "}
						</span>
						{icon ? (
							<MediaImage
								src={icon}
								alt=""
								width={20}
								height={20}
								className="inline"
								loading="eager"
							/>
						) : headingEmoji ? (
							<span>{headingEmoji}</span>
						) : null}
					</div>
				</h2>

				{hasVideo && (
					<video
						src={videoUrl}
						autoPlay
						loop
						muted
						playsInline
						width={300}
						height={200}
						className="h-64 w-auto"
					/>
				)}
			</div>

			{subheading && (
				<p className="text-center font-serif text-2xl text-muted-foreground">
					{subheading}
				</p>
			)}
		</div>
	);
}

import GradientText from "@/components/GradientText";
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
					<div className="inline-flex items-baseline md:inline">
						<GradientText
							colors={[gradientFrom, gradientTo]}
							direction="horizontal"
							className="mx-0 inline-flex! overflow-visible rounded-none font-serif text-4xl"
						>
							{headingHighlight}
						</GradientText>
						{icon ? (
							<MediaImage
								src={icon}
								alt=""
								width={0}
								height={0}
								sizes="24px"
								className="ml-2 inline-block h-5 w-auto align-middle"
								loading="eager"
							/>
						) : headingEmoji ? (
							<span className="ml-0.5">{headingEmoji}</span>
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

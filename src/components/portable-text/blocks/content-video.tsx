import type { ContentVideoDTO } from "@/sanity/lib/dal";

interface ContentVideoProps {
	value: ContentVideoDTO;
}

/**
 * Inline Cloudinary video. Delivered as a plain `<video>` element (Cloudinary
 * already serves an HLS-friendly MP4 with f_auto/q_auto), so no extra player
 * library required. `playsInline` keeps iOS from jumping into fullscreen for
 * autoplay loops.
 */
export function ContentVideo({ value }: ContentVideoProps) {
	return (
		<figure className="not-prose my-8">
			<video
				src={value.url}
				autoPlay={value.autoplay}
				loop={value.loop}
				muted={value.muted}
				controls={value.controls}
				playsInline
				className="w-full rounded-lg"
			/>
			{value.caption && (
				<figcaption className="mt-2 text-center text-xs font-light text-muted-foreground">
					{value.caption}
				</figcaption>
			)}
		</figure>
	);
}

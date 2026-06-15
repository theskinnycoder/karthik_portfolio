import { CaveatHeading } from "@/components/caveat-heading";
import { getHighlights, getSectionHeader } from "@/sanity/lib/dal";
import { ProudMomentCard } from "./proud-moment-card";

export async function ProudMomentsSection() {
	const [highlights, header] = await Promise.all([
		getHighlights(),
		getSectionHeader("proud-moments"),
	]);

	if (highlights.length === 0) return null;

	const headingText = header?.headingHighlight ?? "Proud Moment(s)";

	return (
		<section className="flex flex-col gap-8">
			<div className="relative w-fit">
				<CaveatHeading text={headingText} />
			</div>

			{header?.subheading && (
				<p className="-mt-4 text-left text-base font-light text-muted-foreground">
					{header.subheading}
				</p>
			)}

			<div className="grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
				{highlights.map((item, idx) => (
					<ProudMomentCard
						key={item.slug}
						item={item}
						priority={idx < 2}
					/>
				))}
			</div>
		</section>
	);
}

import type { PortableTextComponents } from "next-sanity";
import { MediaImage } from "@/components/media";
import type { ContentImageDTO } from "@/sanity/lib/dal";
import { cn } from "@/lib/utils";

/**
 * Full-fat component map for case-study articles. Covers the full text-flow
 * vocabulary — headings, lists, marks, link annotations — plus the
 * Cloudinary-backed `contentImage` block.
 */
export const articleComponents: PortableTextComponents = {
	block: {
		normal: ({ children }) => (
			<p className="text-base leading-relaxed font-normal text-muted-foreground">
				{children}
			</p>
		),
		h1: ({ children }) => (
			<h1 className="mt-12 text-3xl font-normal text-foreground">{children}</h1>
		),
		h2: ({ children }) => (
			<h2 className="mt-10 text-2xl font-normal text-foreground">{children}</h2>
		),
		h3: ({ children }) => (
			<h3 className="mt-8 text-xl font-normal text-foreground">{children}</h3>
		),
		h4: ({ children }) => (
			<h4 className="mt-6 text-lg font-normal text-foreground">{children}</h4>
		),
		h5: ({ children }) => (
			<h5 className="mt-6 text-base font-normal text-foreground">{children}</h5>
		),
		h6: ({ children }) => (
			<h6 className="mt-6 text-sm font-normal text-foreground">{children}</h6>
		),
		blockquote: ({ children }) => (
			<blockquote className="my-6 border-l-2 border-border pl-4 text-base font-normal text-muted-foreground italic">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="my-3 list-disc space-y-2 pl-6 text-base font-normal text-muted-foreground">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="my-3 list-decimal space-y-2 pl-6 text-base font-normal text-muted-foreground">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li className="pl-1">{children}</li>,
		number: ({ children }) => <li className="pl-1">{children}</li>,
	},
	marks: {
		strong: ({ children }) => (
			<span className="font-medium text-foreground">{children}</span>
		),
		em: ({ children }) => <em className="italic">{children}</em>,
		code: ({ children }) => (
			<code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
				{children}
			</code>
		),
		fontRegular: ({ children }) => (
			<span className="font-normal">{children}</span>
		),
		fontMedium: ({ children }) => (
			<span className="font-medium">{children}</span>
		),
		fontSemibold: ({ children }) => (
			<span className="font-semibold">{children}</span>
		),
		fontBold: ({ children }) => <span className="font-bold">{children}</span>,
		link: ({ value, children }) => {
			const href = typeof value?.href === "string" ? value.href : "#";
			const openInNewTab = Boolean(value?.openInNewTab);
			return (
				<a
					href={href}
					target={openInNewTab ? "_blank" : undefined}
					rel={openInNewTab ? "noopener noreferrer" : undefined}
					className="text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
				>
					{children}
				</a>
			);
		},
	},
	types: {
		contentImage: ({ value }: { value: ContentImageDTO }) => {
			if (!value.url) return null;
			const dimensions = sizeToDimensions(value.size);
			return (
				<figure
					className={cn(
						"my-8",
						value.size === "wide" && "md:-mx-16 lg:-mx-24",
						value.size === "full" && "-mx-6",
					)}
				>
					<MediaImage
						src={value.url}
						alt={value.alt}
						width={dimensions.width}
						height={dimensions.height}
						className={cn(
							"w-full object-cover",
							value.size === "full" ? "rounded-none" : "rounded-lg",
						)}
					/>
					{value.caption && (
						<figcaption className="mt-2 text-center text-xs font-light text-muted-foreground">
							{value.caption}
						</figcaption>
					)}
				</figure>
			);
		},
	},
};

function sizeToDimensions(size: ContentImageDTO["size"]) {
	switch (size) {
		case "full":
			return { width: 1600, height: 900 };
		case "wide":
			return { width: 1400, height: 787 };
		case "inline":
		default:
			return { width: 1200, height: 675 };
	}
}

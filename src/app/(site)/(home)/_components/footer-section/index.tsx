import Image from "next/image";
import { FOOTER_DIVIDER_ID } from "@/lib/sections";

export { FOOTER_DIVIDER_ID };

// WhatsApp SVG icon — inline so no external asset needed
function WhatsAppIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={20}
			height={20}
			fill="white"
			aria-hidden="true"
		>
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
		</svg>
	);
}

export function FooterSection() {
	return (
		<footer className="w-full pb-[3.125rem]">
			{/* Separator — full-width edge to edge */}
			<hr
				id={FOOTER_DIVIDER_ID}
				className="border-border"
			/>

			{/* Content */}
			<div className="mx-auto mt-12 flex max-w-5xl flex-col items-center gap-5 px-6 md:px-[1.125rem]">
				{/* Heading + Flower */}
				<div className="flex items-start gap-3">
					<p className="font-serif text-[28px] leading-normal">
						<span className="font-normal text-foreground">{`Let's Work `}</span>
						<span
							className="font-semibold text-transparent"
							style={{
								backgroundImage:
									"linear-gradient(-84deg, #FBBA27 13%, #FB7481 76%)",
								WebkitBackgroundClip: "text",
								backgroundClip: "text",
							}}
						>
							Together{" "}
						</span>
						<span className="font-normal text-foreground">:)</span>
					</p>
					<Image
						src="/Flower.png"
						alt=""
						width={30}
						height={44}
						aria-hidden="true"
						className="shrink-0"
					/>
				</div>

				{/* WhatsApp Button */}
				<a
					href="https://wa.me/918008892112"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center rounded-full transition-opacity hover:opacity-90"
					style={{ backgroundColor: "#25D467" }}
					aria-label="Connect with Karthik on WhatsApp"
				>
					<span className="flex items-center gap-1.5 px-4 py-3">
						<WhatsAppIcon />
						<span className="font-sans text-base font-semibold tracking-wide text-white">
							Connect on WhatsApp
						</span>
					</span>
				</a>
			</div>
		</footer>
	);
}

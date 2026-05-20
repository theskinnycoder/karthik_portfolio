import Image from "next/image";
import { existsSync } from "fs";
import path from "path";
import { ContactButton } from "./contact-button";

function hasFlowerIcon() {
	try {
		return existsSync(path.join(process.cwd(), "public", "flower-icon.png"));
	} catch {
		return false;
	}
}

export function ContactSection() {
	const showIcon = hasFlowerIcon();

	return (
		<section className="flex flex-col items-center gap-[59px]">
			<div className="flex items-start gap-[12px]">
				<h2 className="font-serif text-[28px] leading-normal">
					<span className="font-normal text-white">{"Let's Work "}</span>
					<span
						className="bg-clip-text font-semibold text-transparent"
						style={{
							backgroundImage:
								"linear-gradient(-84.15deg, rgb(251,186,39) 12.943%, rgb(251,116,129) 75.867%)",
						}}
					>
						{"together "}
					</span>
					<span className="font-normal text-white">:)</span>
				</h2>

				{showIcon && (
					<Image
						src="/flower-icon.png"
						alt=""
						width={28}
						height={41}
						className="shrink-0"
						unoptimized
					/>
				)}
			</div>

			<ContactButton />
		</section>
	);
}

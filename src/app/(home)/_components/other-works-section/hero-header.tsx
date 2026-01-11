import Image from "next/image";

export function HeroHeader() {
	return (
		<div className="flex flex-col items-center gap-12">
			<div className="flex flex-col items-center gap-12">
				<h2 className="text-center font-serif text-4xl">
					<span className="text-muted-foreground">How I design with my </span>
					<div className="inline-flex items-baseline space-x-2 md:inline">
						<span className="bg-linear-to-r from-[#FBBA27] to-[#FB7481] bg-clip-text text-transparent">
							Overthinking!!
						</span>
						<span>👀</span>
					</div>
				</h2>

				<Image
					src="/mind.gif"
					alt="Overthinking animation"
					width={244}
					height={164}
					unoptimized
				/>
			</div>

			<p className="text-center font-serif text-2xl text-muted-foreground">
				Here are some other designs I tinkered around with
			</p>
		</div>
	);
}

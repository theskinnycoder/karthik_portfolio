import Image from "next/image";

const companies = [
	{
		src: "/logos/apxor-logo.svg",
		alt: "Apxor Logo",
		width: 84,
		height: 26,
	},
	{
		src: "/logos/hearzap-logo.svg",
		alt: "Hearzap Logo",
		width: 103,
		height: 26,
	},
	{
		src: "/logos/eclaire-logo.svg",
		alt: "Eclaire Logo",
		width: 65,
		height: 26,
	},
] as const;

export function CompanyLogos() {
	return (
		<div className="flex flex-wrap items-center gap-x-16 gap-y-4">
			{companies.map((company) => (
				<Image
					key={company.alt}
					src={company.src}
					alt={company.alt}
					width={company.width}
					height={company.height}
					className="h-[26px]"
				/>
			))}
		</div>
	);
}

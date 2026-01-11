import Image from "next/image";

const companies = [
	{
		src: "/apxor-logo.svg",
		alt: "Apxor Logo",
		width: 82,
		height: 24,
	},
	{
		src: "/hearzap-logo.svg",
		alt: "Hearzap Logo",
		width: 112,
		height: 24,
	},
	{
		src: "/eclaire-logo.svg",
		alt: "Eclaire Logo",
		width: 64,
		height: 24,
	},
] as const;

export function CompanyLogos() {
	return (
		<div className="grid grid-cols-2 items-center gap-x-1 gap-y-3.5">
			{companies.map((company) => (
				<Image
					key={company.alt}
					src={company.src}
					alt={company.alt}
					width={company.width}
					height={company.height}
				/>
			))}
		</div>
	);
}

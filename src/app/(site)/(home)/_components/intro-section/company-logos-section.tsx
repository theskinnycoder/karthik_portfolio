import { MediaImage } from "@/components/media";
import { getCompanies } from "@/sanity/lib/dal";

export async function CompanyLogos() {
	const companies = await getCompanies();

	return (
		<div className="flex flex-wrap items-center gap-x-16 gap-y-4 md:gap-x-8">
			{companies.map((company) => (
				<MediaImage
					key={company.name}
					src={company.logo}
					alt={company.name}
					width={0}
					height={0}
					className="h-6.5 w-auto"
					sizes="100vw"
					loading="eager"
				/>
			))}
		</div>
	);
}

import { getCompanies } from "@/sanity/lib/dal";
import Image from "next/image";

export async function CompanyLogos() {
	const companies = await getCompanies();

	return (
		<div className="flex flex-wrap items-center gap-x-16 gap-y-4">
			{companies.map((company) => (
				<Image
					key={company.name}
					src={company.logo}
					alt={company.name}
					width={1920}
					height={1080}
					className="h-[26px] w-fit"
				/>
			))}
		</div>
	);
}

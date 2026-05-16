import * as React from "react";
import { MediaImage } from "@/components/media";
import { getCompanies } from "@/sanity/lib/dal";

export async function CompanyLogos() {
	const companies = await getCompanies();

	return (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
			{companies.map((company, index) => (
				<React.Fragment key={company.name}>
					<MediaImage
						src={company.logo}
						alt={company.name}
						width={0}
						height={0}
						className="h-7 w-auto object-contain object-left transition-opacity md:h-8"
						sizes="100vw"
						loading="eager"
					/>
					{index === 1 && (
						<div className="basis-full min-[425px]:hidden" aria-hidden="true" />
					)}
				</React.Fragment>
			))}
		</div>
	);
}

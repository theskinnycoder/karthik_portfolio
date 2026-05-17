import { getCompanies } from "@/sanity/lib/dal";
import { CompanyLogosClient } from "./company-logos-client";

export async function CompanyLogos() {
	const companies = await getCompanies();
	return <CompanyLogosClient companies={companies} />;
}

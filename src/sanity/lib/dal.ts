import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { cache } from "react";
import "server-only";
import { sanityFetch } from "./fetch";
import { urlFor } from "./image";
import { companiesQuery, testimonialsQuery } from "./queries";

/**
 * ========================
 * Sanity Schema Types
 * ========================
 */

interface SanityCompany {
	_id: string;
	name: string;
	logo?: SanityImageSource;
	website?: string;
	description?: string;
}

interface SanityTestimonial {
	_id: string;
	quote: string;
	authorName: string;
	authorRole: string;
	authorAvatar?: SanityImageSource;
	company: SanityCompany;
}

/**
 * ========================
 * Data transfer objects
 * ========================
 */

export interface CompanyDTO {
	name: string;
	logo: string;
	website?: string;
	description?: string;
}

export interface TestimonialDTO {
	quote: string;
	authorName: string;
	authorRole: string;
	authorAvatar: string;
	company: CompanyDTO;
}

/**
 * ========================
 * Data transfer object mappers
 * ========================
 */

function toTestimonialDTO(data: SanityTestimonial) {
	const testimonial: TestimonialDTO = {
		quote: data.quote,
		authorName: data.authorName,
		authorRole: data.authorRole,
		authorAvatar: data.authorAvatar ? urlFor(data.authorAvatar).url() : "",
		company: {
			name: data.company.name,
			logo: data.company.logo ? urlFor(data.company.logo).url() : "",
		},
	};
	return testimonial;
}

function toCompanyDTO(data: SanityCompany) {
	const company: CompanyDTO = {
		name: data.name,
		logo: data.logo ? urlFor(data.logo).url() : "",
		website: data?.website,
		description: data?.description,
	};
	return company;
}

/**
 * ========================
 * Data fetching functions
 * ========================
 */

export const getTestimonials = cache(async (): Promise<TestimonialDTO[]> => {
	const testimonials = await sanityFetch<SanityTestimonial[]>({
		query: testimonialsQuery,
		tags: ["testimonials"],
	});

	return testimonials.map(toTestimonialDTO);
});

export const getCompanies = cache(async (): Promise<CompanyDTO[]> => {
	const companies = await sanityFetch<SanityCompany[]>({
		query: companiesQuery,
		tags: ["companies"],
	});

	return companies.map(toCompanyDTO);
});

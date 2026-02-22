import type { PortableTextBlock } from "next-sanity";
import { tagResource } from "@/lib/caching";
import type { CloudinaryAsset } from "@/lib/media";
import { getMediaUrl } from "@/lib/media";
import "server-only";
import { sanityFetch } from "./fetch";
import {
	companiesQuery,
	experiencesQuery,
	projectsQuery,
	sectionHeaderQuery,
	siteProfileQuery,
	socialsQuery,
	testimonialsQuery,
} from "./queries";

/**
 * ========================
 * Sanity Schema Types
 * ========================
 */

interface SanityCompany {
	_id: string;
	name: string;
	logo: CloudinaryAsset;
	website?: string;
	description?: string;
}

interface SanityTestimonial {
	_id: string;
	quote: string;
	authorName: string;
	authorRole: string;
	authorAvatar?: CloudinaryAsset;
	company: SanityCompany;
}

interface SanitySocial {
	_id: string;
	label: string;
	href: string;
	icon: CloudinaryAsset;
}

interface SanityProject {
	_id: string;
	name: string;
	image: CloudinaryAsset;
	alt: string;
	backgroundColor: string;
}

interface SanityExperience {
	_id: string;
	company: string;
	url: string;
	role: string;
	description: string;
}

interface SanitySiteProfile {
	_id: string;
	name: string;
	title: string;
	bio: PortableTextBlock[];
}

interface SanitySectionHeader {
	_id: string;
	headingPrefix?: string;
	headingHighlight: string;
	headingEmoji?: string;
	icon: CloudinaryAsset;
	gradientFrom?: string;
	gradientTo?: string;
	video?: CloudinaryAsset;
	subheading?: string;
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

export interface SocialDTO {
	label: string;
	href: string;
	icon: string;
}

export interface ProjectDTO {
	name: string;
	image: string;
	alt: string;
	backgroundColor: string;
}

export interface ExperienceDTO {
	company: string;
	url: string;
	role: string;
	description: string;
}

export interface SiteProfileDTO {
	name: string;
	title: string;
	bio: PortableTextBlock[];
}

export interface SectionHeaderDTO {
	headingPrefix?: string;
	headingHighlight: string;
	headingEmoji?: string;
	icon?: string;
	gradientFrom?: string;
	gradientTo?: string;
	videoUrl?: string;
	subheading?: string;
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
		authorAvatar: getMediaUrl(data.authorAvatar),
		company: {
			name: data.company.name,
			logo: getMediaUrl(data.company.logo),
		},
	};
	return testimonial;
}

function toCompanyDTO(data: SanityCompany) {
	const company: CompanyDTO = {
		name: data.name,
		logo: getMediaUrl(data.logo),
		website: data?.website,
		description: data?.description,
	};
	return company;
}

function toSocialDTO(data: SanitySocial): SocialDTO {
	return {
		label: data.label,
		href: data.href,
		icon: getMediaUrl(data.icon),
	};
}

function toProjectDTO(data: SanityProject): ProjectDTO {
	return {
		name: data.name,
		image: getMediaUrl(data.image),
		alt: data.alt,
		backgroundColor: data.backgroundColor,
	};
}

function toExperienceDTO(data: SanityExperience): ExperienceDTO {
	return {
		company: data.company,
		url: data.url,
		role: data.role,
		description: data.description,
	};
}

function toSectionHeaderDTO(data: SanitySectionHeader): SectionHeaderDTO {
	return {
		headingPrefix: data.headingPrefix,
		headingHighlight: data.headingHighlight,
		headingEmoji: data.headingEmoji,
		icon: getMediaUrl(data.icon),
		gradientFrom: data.gradientFrom,
		gradientTo: data.gradientTo,
		videoUrl: getMediaUrl(data.video),
		subheading: data.subheading,
	};
}

/**
 * ========================
 * Cached Data Getters
 * ========================
 */

export async function getTestimonials() {
	await tagResource("testimonial");

	const testimonials = await sanityFetch<SanityTestimonial[]>({
		query: testimonialsQuery,
	});
	return testimonials.map(toTestimonialDTO);
}

export async function getCompanies() {
	await tagResource("company");

	const companies = await sanityFetch<SanityCompany[]>({
		query: companiesQuery,
	});
	return companies.map(toCompanyDTO);
}

export async function getSocials(): Promise<SocialDTO[]> {
	await tagResource("social");

	const socials = await sanityFetch<SanitySocial[]>({
		query: socialsQuery,
	});
	return socials.map(toSocialDTO);
}

export async function getProjects(): Promise<ProjectDTO[]> {
	await tagResource("project");

	const projects = await sanityFetch<SanityProject[]>({
		query: projectsQuery,
	});
	return projects.map(toProjectDTO);
}

export async function getExperiences(): Promise<ExperienceDTO[]> {
	await tagResource("experience");

	const experiences = await sanityFetch<SanityExperience[]>({
		query: experiencesQuery,
	});
	return experiences.map(toExperienceDTO);
}

export async function getSiteProfile(): Promise<SiteProfileDTO | null> {
	await tagResource("siteProfile");

	const profile = await sanityFetch<SanitySiteProfile | null>({
		query: siteProfileQuery,
	});
	if (!profile) return null;
	return {
		name: profile.name,
		title: profile.title,
		bio: profile.bio,
	};
}

export async function getSectionHeader(
	slug: string,
): Promise<SectionHeaderDTO | null> {
	await tagResource("sectionHeader");

	const header = await sanityFetch<SanitySectionHeader | null>({
		query: sectionHeaderQuery,
		params: { slug },
	});
	if (!header) return null;
	return toSectionHeaderDTO(header);
}

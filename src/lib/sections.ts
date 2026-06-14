export const SECTIONS = ["about", "work", "proud-moments", "blogs"] as const;

export type SectionId = (typeof SECTIONS)[number];

export const FOOTER_DIVIDER_ID = "footer-divider";

export const SECTION_URLS: Record<SectionId, string> = {
	about: "/",
	work: "/work",
	"proud-moments": "/proud-moments",
	blogs: "/blogs",
};

export const PATHNAME_TO_SECTION: Record<string, SectionId> = {
	"/": "about",
	"/work": "work",
	"/proud-moments": "proud-moments",
	"/blogs": "blogs",
};

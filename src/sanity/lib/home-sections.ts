export const HOME_SECTION_KEYS = [
	"intro",
	"experience",
	"otherWorks",
	"work",
	"proudMoments",
	"testimonials",
	"blogs",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
	intro: "Intro",
	experience: "Experience",
	otherWorks: "Other Works",
	work: "Work Items",
	proudMoments: "Proud Moment(s)",
	testimonials: "Testimonials",
	blogs: "Blogs",
};

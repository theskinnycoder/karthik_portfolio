import { defineQuery, groq } from "next-sanity";

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    quote,
    authorName,
    authorRole,
    authorAvatar,
    company->{
      _id,
      name,
      logo
    }
  }
`;

export const companiesQuery = groq`
  *[_type == "company"] | order(order asc) {
    _id,
    name,
		logo,
		website
	}
`;

export const socialsQuery = groq`
  *[_type == "social"] | order(order asc) {
    _id,
    label,
    href,
    icon
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    name,
    image,
    alt,
    backgroundColor
  }
`;

export const experiencesQuery = groq`
  *[_type == "experience"] | order(order asc) {
    _id,
    company,
    url,
    role,
    description
  }
`;

// Singleton - query by type (desk structure ensures only one exists)
export const siteProfileQuery = groq`
  *[_type == "siteProfile"][0] {
    _id,
    name,
    title,
    bio
  }
`;

// Singleton - section order for the home page
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    sections
  }
`;

export const workPageQuery = groq`
  *[_type == "company" && count(*[_type == "workItem" && references(^._id)]) > 0] | order(order asc) {
    _id,
    name,
    logo,
    website,
    isCurrent,
    badge,
    workTagline,
    workDescription,
    "workItems": *[_type == "workItem" && references(^._id)] | order(order asc) {
      _id,
      title,
      icon,
      tag,
      image,
      description,
      "slug": slug.current,
      "brandFrom": brand.primary,
      "brandTo": brand.secondary
    }
  }
`;

// Collection - query by slug
export const sectionHeaderQuery = groq`
  *[_type == "sectionHeader" && slug.current == $slug][0] {
    _id,
    headingPrefix,
    headingHighlight,
    headingEmoji,
    icon,
    gradientFrom,
    gradientTo,
    video,
    subheading
  }
`;

export const workItemBySlugQuery = defineQuery(`
  *[_type == "workItem" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    tag,
    description,
    excerpt,
    liveUrl,
    image,
    heroImage,
    brand,
    content[] {
      ...,
      _type == "contentTestimonial" => {
        _type,
        _key,
        "testimonial": testimonial->{
          _id,
          quote,
          authorName,
          authorRole,
          authorAvatar,
          company->{
            _id,
            name,
            logo
          }
        }
      }
    },
    "prev": *[_type == "workItem" && order < ^.order && defined(slug.current)]
      | order(order desc)[0] {
        title,
        "slug": slug.current,
        tag
      },
    "next": *[_type == "workItem" && order > ^.order && defined(slug.current)]
      | order(order asc)[0] {
        title,
        "slug": slug.current,
        tag
      },
    "company": company->{
      _id,
      name,
      logo,
      website
    }
  }
`);

export const allWorkItemSlugsQuery = groq`
  *[_type == "workItem" && defined(slug.current)].slug.current
`;

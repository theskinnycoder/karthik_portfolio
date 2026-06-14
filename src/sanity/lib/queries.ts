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
    description,
    backgroundColor,
    url
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
    bio,
    availabilityMessage,
    heroVideo
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
      "brandTo": brand.secondary,
      "brandIcon": brand.icon
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
        quote,
        authorName,
        authorRole,
        companyLogo,
        authorAvatar
      },
      _type == "contentTable" => {
        _type,
        _key,
        caption,
        headers,
        "rows": rows[]{
          _key,
          cells
        }
      }
    },
    "orderedItems": *[_type == "workItem" && defined(slug.current)] | order(company->order asc, order asc) {
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

// ----- Highlights (Proud Moments) -----

export const highlightsQuery = groq`
  *[_type == "highlight" && defined(slug.current)] | order(date desc, order asc) {
    _id,
    title,
    description,
    date,
    image,
    "slug": slug.current
  }
`;

export const highlightBySlugQuery = defineQuery(`
  *[_type == "highlight" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    date,
    image,
    content[] {
      ...,
      _type == "contentTestimonial" => {
        _type,
        _key,
        quote,
        authorName,
        authorRole,
        companyLogo,
        authorAvatar
      },
      _type == "contentTable" => {
        _type,
        _key,
        caption,
        headers,
        "rows": rows[]{
          _key,
          cells
        }
      }
    },
    "orderedItems": *[_type == "highlight" && defined(slug.current)] | order(date desc, order asc) {
      title,
      "slug": slug.current
    }
  }
`);

export const allHighlightSlugsQuery = groq`
  *[_type == "highlight" && defined(slug.current)].slug.current
`;

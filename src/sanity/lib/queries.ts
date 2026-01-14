import { groq } from "next-sanity";

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
		website,
		description
	}
`;

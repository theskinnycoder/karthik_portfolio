# Sanity Data Access Layer Patterns

Detailed reference for Sanity CMS integration with the Data Access Layer pattern.

## Directory Structure

```
src/sanity/
├── schemaTypes/       # Document type definitions
│   └── index.ts       # Schema exports
├── lib/
│   ├── client.ts      # Sanity client configuration
│   ├── env.ts         # Environment config
│   ├── fetch.ts       # Fetch wrapper
│   ├── queries.ts     # GROQ queries
│   └── dal.ts         # Data Access Layer
├── plugins/           # Custom plugins
└── structure.ts       # Studio desk structure

src/lib/media/
├── index.ts                  # Re-exports + factory
├── types.ts                  # CloudinaryAsset type
├── media-service.ts          # Abstract class
└── cloudinary.service.ts     # Cloudinary implementation
```

## GROQ Queries

### Query Definition

Always use `defineQuery` for TypeGen support:

```typescript
// src/sanity/lib/queries.ts
import { defineQuery } from "next-sanity";

export const testimonialsQuery = defineQuery(/* groq */ `
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
`);

export const companiesQuery = defineQuery(/* groq */ `
  *[_type == "company"] | order(order asc) {
    _id,
    name,
    logo,
    website,
    description
  }
`);
```

### Common GROQ Patterns

```groq
// Ordering (always BEFORE slice)
*[_type == "post"] | order(publishedAt desc)[0...10]

// Single document
*[_type == "page" && slug.current == $slug][0]

// Reference expansion
author->{ name, bio }

// Conditional projection
"badge": select(
  stock == 0 => "Out of Stock",
  stock < 5 => "Low Stock",
  "In Stock"
)

// Count
count(*[_type == "post" && references(^._id)])

// Default values
"title": coalesce(seoTitle, title, "Untitled")
```

## Centralized Cache Utilities

Cache configuration is centralized in `src/lib/caching.ts`:

```typescript
// src/lib/caching.ts
import { cacheLife, cacheTag } from "next/cache";

// Default cache life profile (revalidate: 1 day, expire: 1 week)
export const CACHE_LIFE = "days" as const;

export const DOCUMENT_TYPE_TO_TAGS = {
	testimonial: ["testimonials"],
	company: ["companies"],
} as const;

export function getTags(type: keyof typeof DOCUMENT_TYPE_TO_TAGS) {
	return DOCUMENT_TYPE_TO_TAGS[type];
}

// Page-level cache life helper
export function cachePageLife() {
	cacheLife(CACHE_LIFE);
}

// DAL-level cache helper
export async function tagResource(type: keyof typeof DOCUMENT_TYPE_TO_TAGS) {
	"use cache";
	cacheLife(CACHE_LIFE);
	cacheTag(getTags(type)[0]);
}
```

### Page-Level Usage

```tsx
"use cache";

import { cachePageLife } from "@/lib/caching";

export default async function Page() {
	cachePageLife(); // Required to get 1d revalidate (otherwise defaults to 15m)

	return <main>...</main>;
}
```

## DAL Implementation

### Full Example

```typescript
// src/sanity/lib/dal.ts
import { tagResource } from "@/lib/caching";
import {
	type CloudinaryAsset,
	getMediaUrl,
	getCloudinaryService,
} from "@/lib/media";
import "server-only";
import { sanityFetch } from "./fetch";
import { testimonialsQuery, companiesQuery } from "./queries";

/**
 * ========================
 * Sanity Schema Types (Raw Response)
 * ========================
 */

interface SanityCompany {
	_id: string;
	name: string;
	logo?: CloudinaryAsset;
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

/**
 * ========================
 * DTOs (Component Props)
 * ========================
 */

export interface CompanyDTO {
	name: string;
	logo: string;
	logoPublicId?: string;
	website?: string;
	description?: string;
}

export interface TestimonialDTO {
	quote: string;
	authorName: string;
	authorRole: string;
	authorAvatar: string;
	authorAvatarPublicId?: string;
	company: CompanyDTO;
}

/**
 * ========================
 * Transformers (Sanity → DTO)
 * ========================
 */

function toCompanyDTO(data: SanityCompany): CompanyDTO {
	return {
		name: data.name,
		logo: getMediaUrl(data.logo),
		logoPublicId: data.logo?.public_id,
		website: data.website,
		description: data.description,
	};
}

function toTestimonialDTO(data: SanityTestimonial): TestimonialDTO {
	return {
		quote: data.quote,
		authorName: data.authorName,
		authorRole: data.authorRole,
		authorAvatar: getMediaUrl(data.authorAvatar),
		authorAvatarPublicId: data.authorAvatar?.public_id,
		company: toCompanyDTO(data.company),
	};
}

/**
 * ========================
 * Cached Data Getters
 * ========================
 */

export async function getTestimonials(): Promise<TestimonialDTO[]> {
	await tagResource("testimonial");

	const testimonials = await sanityFetch<SanityTestimonial[]>({
		query: testimonialsQuery,
	});
	return testimonials.map(toTestimonialDTO);
}

export async function getCompanies(): Promise<CompanyDTO[]> {
	await tagResource("company");

	const companies = await sanityFetch<SanityCompany[]>({
		query: companiesQuery,
	});
	return companies.map(toCompanyDTO);
}
```

## Media URL Building (Cloudinary)

### Media Service

Media assets are stored in Cloudinary and managed via `@/lib/media`:

```typescript
// src/lib/media/types.ts
export interface CloudinaryAsset {
	public_id: string;
	resource_type: "image" | "video" | "raw" | "auto";
	format?: string;
	secure_url?: string;
	width?: number;
	height?: number;
}

export interface ImageTransformOptions {
	width?: number;
	height?: number;
	format?: "auto" | "webp" | "png" | "jpg" | "gif";
	quality?: "auto" | number;
	crop?: "fill" | "fit" | "scale" | "thumb";
}
```

### getMediaUrl Helper

```typescript
import { getMediaUrl, getCloudinaryService } from "@/lib/media";

// Get image URL (auto-detects image vs video)
const imageUrl = getMediaUrl(data.logo);

// Get video URL with service
const media = getCloudinaryService();
const videoUrl = media.getVideoUrl(data.video);

// With transformations
const thumbUrl = media.getImageUrl(data.image, {
	width: 200,
	height: 200,
	crop: "fill",
	format: "auto",
	quality: "auto",
});
```

### Usage in Transformers

```typescript
function toDTO(data: SanityType): DTO {
	return {
		// Basic URL
		imageUrl: getMediaUrl(data.image),

		// Include publicId for CldImage component
		imagePublicId: data.image?.public_id,

		// Video URL
		videoUrl: data.video
			? getCloudinaryService().getVideoUrl(data.video)
			: undefined,
		videoPublicId: data.video?.public_id,
	};
}
```

## TypeGen Workflow

### Setup

```json
// sanity-typegen.json
{
	"path": "./src/**/*.{ts,tsx,js,jsx}",
	"schema": "./schema.json",
	"generates": "./src/sanity/types.ts"
}
```

### Commands

```bash
# Extract schema + generate types
bun run sanity:typegen

# Or separately
sanity schema extract --path=./schema.json
sanity typegen generate
```

### Usage

```typescript
import type { TESTIMONIALS_QUERYResult } from "@/sanity/types";

// Types are automatically inferred from query
const testimonials: TESTIMONIALS_QUERYResult = await sanityFetch({
	query: testimonialsQuery,
});
```

## Schema Best Practices

### Use Define Helpers

```typescript
import { defineType, defineField, defineArrayMember } from "sanity";
import { UserIcon } from "@sanity/icons";

export const testimonial = defineType({
	name: "testimonial",
	title: "Testimonial",
	type: "document",
	icon: UserIcon,
	fields: [
		defineField({
			name: "quote",
			type: "text",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "authorName",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "authorAvatar",
			title: "Author Avatar",
			type: "cloudinary.asset",
		}),
		defineField({
			name: "company",
			type: "reference",
			to: [{ type: "company" }],
		}),
	],
});
```

### Cloudinary Asset Fields

Use `cloudinary.asset` type for all media fields:

```typescript
defineField({
	name: "logo",
	title: "Logo",
	type: "cloudinary.asset",
	validation: (rule) => rule.required(),
}),
```

### Validation Patterns

```typescript
// Required field
validation: (rule) => rule.required();

// Max length
validation: (rule) => rule.max(200).warning("Keep it concise");

// Custom validation
validation: (rule) =>
	rule.custom((value, context) => {
		if (!value && context.document?.featured) {
			return "Required for featured items";
		}
		return true;
	});
```

## Webhook Revalidation

### API Route

```typescript
// src/app/api/revalidate/route.ts
import { DOCUMENT_TYPE_TO_TAGS, getTags } from "@/lib/caching";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

interface SanityWebhookPayload {
	_type: keyof typeof DOCUMENT_TYPE_TO_TAGS;
	_id: string;
}

export async function POST(request: NextRequest) {
	const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
		request,
		process.env.SANITY_WEBHOOK_SECRET,
		true, // Delay for CDN
	);

	if (!isValidSignature) {
		return NextResponse.json({ error: "Invalid" }, { status: 401 });
	}

	const tags = getTags(body._type);
	for (const tag of tags) {
		revalidateTag(tag, "max"); // Stale-while-revalidate
	}

	return NextResponse.json({ revalidated: true, tags });
}
```

### Sanity Webhook Config

In Sanity Dashboard (sanity.io/manage):

1. **API > Webhooks > Create**
2. Configure:
   - URL: `https://your-domain.com/api/revalidate`
   - Trigger: Create, Update, Delete
   - Filter: `_type in ["testimonial", "company"]`
   - Projection: `{_type, _id}`
   - Secret: Copy to `SANITY_WEBHOOK_SECRET`

## Adding New Content Types

### Checklist

1. **Create schema** in `src/sanity/schemaTypes/newType.ts`
   - Use `cloudinary.asset` for media fields
2. **Export from index** in `schemaTypes/index.ts`
3. **Add GROQ query** in `queries.ts`
4. **Add to `DOCUMENT_TYPE_TO_TAGS`** in `src/lib/caching.ts`
5. **Add types** (Sanity interface + DTO) in `dal.ts`
   - Use `CloudinaryAsset` for media fields in Sanity interface
   - Include `publicId` fields in DTO for CldImage component
6. **Add transformer** function in `dal.ts`
   - Use `getMediaUrl()` for image/video URLs
7. **Add cached getter** using `await tagResource("newType")` in `dal.ts`
8. **Deploy schema**: `bun run sanity:schema:deploy`
9. **Generate types**: `bun run sanity:typegen`

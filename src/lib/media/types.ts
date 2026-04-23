/**
 * Cloudinary asset shape returned by sanity-plugin-cloudinary.
 *
 * Field-level optionality matches what Sanity TypeGen emits for `cloudinary.asset`
 * in `sanity.types.ts` — every field is technically optional because the plugin
 * doesn't enforce them in the schema. In practice, populated assets always carry
 * `public_id`, `resource_type`, `type`, and `format`; `getMediaUrl()` guards for
 * missing values at runtime.
 */
export interface CloudinaryAsset {
	_type: "cloudinary.asset";
	public_id?: string;
	resource_type?: string;
	type?: string;
	format?: string;
	version?: number;
	url?: string;
	secure_url?: string;
	width?: number;
	height?: number;
	bytes?: number;
	duration?: number;
	created_at?: string;
	access_mode?: string;
}

/**
 * Common image transformation options
 */
export interface ImageTransformOptions {
	width?: number;
	height?: number;
	format?: "auto" | "webp" | "avif" | "png" | "jpg";
	quality?:
		| number
		| "auto"
		| "auto:best"
		| "auto:good"
		| "auto:eco"
		| "auto:low";
	crop?: "fill" | "fit" | "scale" | "thumb" | "pad";
	gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
}

/**
 * Common video transformation options
 */
export interface VideoTransformOptions {
	width?: number;
	height?: number;
	format?: "auto" | "mp4" | "webm";
	quality?:
		| number
		| "auto"
		| "auto:best"
		| "auto:good"
		| "auto:eco"
		| "auto:low";
}

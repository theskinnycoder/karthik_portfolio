import type {
	CloudinaryAsset,
	ImageTransformOptions,
	VideoTransformOptions,
} from "./types";

/**
 * Abstract media service interface for provider-agnostic media handling.
 */
export abstract class MediaService {
	abstract readonly provider: "cloudinary";

	/**
	 * Generate a URL for an image asset with optional transformations
	 */
	abstract getImageUrl(
		asset: CloudinaryAsset,
		options?: ImageTransformOptions,
	): string;

	/**
	 * Generate a URL for a video asset with optional transformations
	 */
	abstract getVideoUrl(
		asset: CloudinaryAsset,
		options?: VideoTransformOptions,
	): string;

	/**
	 * Check if the asset is a video
	 */
	abstract isVideo(asset: CloudinaryAsset): boolean;
}

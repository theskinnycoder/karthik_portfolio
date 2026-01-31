export { CloudinaryMediaService } from "./cloudinary.service";
export { MediaService } from "./media-service";
export type {
	CloudinaryAsset,
	ImageTransformOptions,
	VideoTransformOptions,
} from "./types";

import { CloudinaryMediaService } from "./cloudinary.service";
import type { CloudinaryAsset } from "./types";

// Singleton instance
let cloudinaryService: CloudinaryMediaService | null = null;

/**
 * Get the Cloudinary media service instance (singleton)
 */
export function getCloudinaryService(): CloudinaryMediaService {
	if (!cloudinaryService) {
		cloudinaryService = new CloudinaryMediaService();
	}
	return cloudinaryService;
}

/**
 * Convenience function to get a URL for any Cloudinary asset
 */
export function getMediaUrl(
	asset: CloudinaryAsset | undefined | null,
	options?: { width?: number; height?: number },
): string {
	if (!asset) return "";

	const service = getCloudinaryService();

	if (service.isVideo(asset)) {
		return service.getVideoUrl(asset, options);
	}

	return service.getImageUrl(asset, options);
}

export { CloudinaryMediaService } from "./cloudinary.service";
export type { CloudinaryAsset } from "./types";

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
 * Convenience function to get a URL for any Cloudinary asset.
 *
 * Returns "" when the asset is missing or lacks the fields required to build a
 * Cloudinary URL (public_id / resource_type / type). Callers should treat ""
 * as "no asset" — `<MediaImage src="">` renders nothing.
 */
export function getMediaUrl(
	asset: CloudinaryAsset | undefined | null,
	options?: { width?: number; height?: number },
): string {
	if (!asset?.public_id || !asset.resource_type || !asset.type) return "";

	const service = getCloudinaryService();

	if (service.isVideo(asset)) {
		return service.getVideoUrl(asset, options);
	}

	return service.getImageUrl(asset, options);
}

import { clientEnv } from "@/env/client";
import { MediaService } from "./media-service";
import type {
	CloudinaryAsset,
	ImageTransformOptions,
	VideoTransformOptions,
} from "./types";

/**
 * Cloudinary media service implementation.
 * Handles URL generation with transformations for Cloudinary-hosted assets.
 */
export class CloudinaryMediaService extends MediaService {
	readonly provider = "cloudinary" as const;
	private readonly cloudName: string;

	constructor() {
		super();
		this.cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
	}

	isVideo(asset: CloudinaryAsset): boolean {
		return asset.resource_type === "video";
	}

	getImageUrl(asset: CloudinaryAsset, options?: ImageTransformOptions): string {
		const transforms = this.buildImageTransforms(options);
		return this.buildUrl(asset, transforms);
	}

	getVideoUrl(asset: CloudinaryAsset, options?: VideoTransformOptions): string {
		const transforms = this.buildVideoTransforms(options);
		return this.buildUrl(asset, transforms);
	}

	/**
	 * Build Cloudinary URL with transformations
	 * Format: https://res.cloudinary.com/{cloud}/{resource_type}/{type}/{transforms}/{public_id}
	 */
	private buildUrl(asset: CloudinaryAsset, transforms: string): string {
		const parts = [
			"https://res.cloudinary.com",
			this.cloudName,
			asset.resource_type,
			asset.type,
		];

		if (transforms) {
			parts.push(transforms);
		}

		// Add public_id with format extension
		const publicIdWithFormat = asset.format
			? `${asset.public_id}.${asset.format}`
			: asset.public_id;
		parts.push(publicIdWithFormat);

		return parts.join("/");
	}

	private buildImageTransforms(options?: ImageTransformOptions): string {
		if (!options) return "f_auto,q_auto";

		const transforms: string[] = [];

		// Format
		if (options.format) {
			transforms.push(`f_${options.format}`);
		} else {
			transforms.push("f_auto");
		}

		// Quality
		if (options.quality !== undefined) {
			transforms.push(`q_${options.quality}`);
		} else {
			transforms.push("q_auto");
		}

		// Dimensions
		if (options.width) {
			transforms.push(`w_${options.width}`);
		}
		if (options.height) {
			transforms.push(`h_${options.height}`);
		}

		// Crop mode
		if (options.crop) {
			transforms.push(`c_${options.crop}`);
		}

		// Gravity
		if (options.gravity) {
			transforms.push(`g_${options.gravity}`);
		}

		return transforms.join(",");
	}

	private buildVideoTransforms(options?: VideoTransformOptions): string {
		if (!options) return "f_auto,q_auto";

		const transforms: string[] = [];

		// Format
		if (options.format) {
			transforms.push(`f_${options.format}`);
		} else {
			transforms.push("f_auto");
		}

		// Quality
		if (options.quality !== undefined) {
			transforms.push(`q_${options.quality}`);
		} else {
			transforms.push("q_auto");
		}

		// Dimensions
		if (options.width) {
			transforms.push(`w_${options.width}`);
		}
		if (options.height) {
			transforms.push(`h_${options.height}`);
		}

		return transforms.join(",");
	}
}

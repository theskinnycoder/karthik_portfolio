import { DOCUMENT_TYPE_TO_TAGS, getTags } from "@/lib/caching";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

interface SanityWebhookPayload {
	_type: keyof typeof DOCUMENT_TYPE_TO_TAGS;
	_id: string;
}

/**
 * Sanity webhook endpoint for on-demand cache revalidation
 *
 * Configure in Sanity Dashboard (sanity.io/manage):
 * - URL: https://your-domain.com/api/revalidate
 * - Trigger: Create, Update, Delete
 * - Filter: _type in ["testimonial", "company"]
 * - Projection: {_type, _id}
 * - Secret: Copy to SANITY_WEBHOOK_SECRET env var
 */
export async function POST(request: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
			request,
			SANITY_WEBHOOK_SECRET,
			true, // Add delay to allow CDN to update
		);

		if (!isValidSignature) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		if (!body?._type) {
			return NextResponse.json(
				{ error: "Missing document type" },
				{ status: 400 },
			);
		}

		const tags = getTags(body._type);

		if (!tags) {
			return NextResponse.json({
				revalidated: false,
				message: `No cache tags configured for type: ${body._type}`,
				now: Date.now(),
			});
		}

		// Revalidate with stale-while-revalidate behavior
		for (const tag of tags) {
			revalidateTag(tag, "max");
		}

		return NextResponse.json({
			revalidated: true,
			tags,
			documentType: body._type,
			documentId: body._id,
			now: Date.now(),
		});
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

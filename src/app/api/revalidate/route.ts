import { serverEnv } from "@/env/server";
import { DOCUMENT_TYPE_TO_TAGS, getTags } from "@/lib/caching";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Flush all cache tags on demand.
 * - In development: no auth required — just hit GET /api/revalidate
 * - In production: requires ?secret=<SANITY_WEBHOOK_SECRET> query param
 *
 * Usage (production):
 *   GET https://imkarthik.in/api/revalidate?secret=YOUR_WEBHOOK_SECRET
 */
export async function GET(request: NextRequest) {
	if (process.env.NODE_ENV !== "development") {
		const { searchParams } = new URL(request.url);
		const secret = searchParams.get("secret");
		if (!secret || secret !== serverEnv.SANITY_WEBHOOK_SECRET) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
	}

	for (const tags of Object.values(DOCUMENT_TYPE_TO_TAGS)) {
		for (const tag of tags) {
			revalidateTag(tag, "max");
		}
	}

	return NextResponse.json({
		revalidated: true,
		message: "All cache tags flushed",
	});
}

interface SanityWebhookPayload {
	_type: string;
	_id: string;
}

/**
 * Sanity webhook endpoint for on-demand cache revalidation
 *
 * Configure in Sanity Dashboard (sanity.io/manage):
 * - URL: https://your-domain.com/api/revalidate
 * - Trigger: Create, Update, Delete
 * - Filter: _type in ["testimonial", "company", "social", "project", "experience", "siteProfile", "sectionHeader", "workItem"]
 * - Projection: {_type, _id}
 * - Secret: Copy to SANITY_WEBHOOK_SECRET env var
 */
export async function POST(request: NextRequest) {
	try {
		const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
			request,
			serverEnv.SANITY_WEBHOOK_SECRET,
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

		if (!(body._type in DOCUMENT_TYPE_TO_TAGS)) {
			return NextResponse.json({
				revalidated: false,
				message: `No cache tags configured for type: ${body._type}`,
				now: Date.now(),
			});
		}

		const tags = getTags(body._type as keyof typeof DOCUMENT_TYPE_TO_TAGS);

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

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(): Promise<NextResponse> {
	return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request): Promise<NextResponse> {
	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		console.error("BLOB_READ_WRITE_TOKEN is not set");
		return NextResponse.json(
			{ error: "Server configuration error: BLOB_READ_WRITE_TOKEN not set" },
			{ status: 500, headers: corsHeaders },
		);
	}

	try {
		const body = (await request.json()) as HandleUploadBody;

		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async () => {
				return {
					allowedContentTypes: [
						"image/jpeg",
						"image/png",
						"image/webp",
						"image/svg+xml",
						"image/gif",
					],
					addRandomSuffix: true,
				};
			},
			onUploadCompleted: async ({ blob }) => {
				console.log("Blob upload completed:", blob.url);
			},
		});

		return NextResponse.json(jsonResponse, { headers: corsHeaders });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 400, headers: corsHeaders },
		);
	}
}

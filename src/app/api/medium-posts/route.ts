import { getMediumPosts } from "@/lib/medium";
import { connection, NextResponse } from "next/server";

export async function GET() {
	await connection();
	const posts = await getMediumPosts();
	return NextResponse.json(posts, {
		headers: {
			"Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}

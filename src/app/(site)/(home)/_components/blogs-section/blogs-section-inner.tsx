"use cache";

import { cacheLife } from "next/cache";
import { getMediumPosts } from "@/lib/medium";
import { BlogsCarousel } from "./blogs-carousel";

export async function BlogsSectionInner() {
	cacheLife({ revalidate: 86400, expire: 86400 }); // 1 day
	const posts = await getMediumPosts();

	if (posts.length === 0) return null;

	return <BlogsCarousel posts={posts} />;
}

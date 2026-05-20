import { getMediumPosts } from "@/lib/medium";
import { BlogsCarousel } from "./blogs-carousel";

export async function BlogsSectionInner() {
	const posts = await getMediumPosts();

	if (posts.length === 0) return null;

	return <BlogsCarousel posts={posts} />;
}

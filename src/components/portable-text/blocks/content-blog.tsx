import type { ContentBlogDTO } from "@/sanity/lib/dal";
import { BlogCard } from "@/app/(site)/(home)/_components/blogs-section/blog-card";

interface ContentBlogProps {
	value: ContentBlogDTO;
}

export function ContentBlog({ value }: ContentBlogProps) {
	return (
		<div className="not-prose">
			<BlogCard
				post={{
					title: value.title,
					link: value.link,
					pubDate: value.pubDate,
					excerpt: value.excerpt,
					thumbnail: value.thumbnail,
				}}
			/>
		</div>
	);
}

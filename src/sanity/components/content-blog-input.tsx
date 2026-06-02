"use client";

import { Card, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { set, unset, PatchEvent } from "sanity";
import type { ObjectInputProps } from "sanity";
import type { MediumPostDTO } from "../../lib/medium";

type BlogValue = {
	title?: string;
	link?: string;
	pubDate?: string;
	excerpt?: string;
	thumbnail?: string;
};

export function ContentBlogInput(props: ObjectInputProps) {
	const { value, onChange } = props;
	const [posts, setPosts] = useState<MediumPostDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		fetch("/api/medium-posts")
			.then((res) => {
				if (!res.ok) throw new Error("Failed");
				return res.json() as Promise<MediumPostDTO[]>;
			})
			.then((data) => {
				setPosts(data);
				setLoading(false);
			})
			.catch(() => {
				setError(true);
				setLoading(false);
			});
	}, []);

	const currentLink = (value as BlogValue | undefined)?.link;
	const currentTitle = (value as BlogValue | undefined)?.title;

	const selectedIndex = posts.findIndex((p) => p.link === currentLink);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const idx = parseInt(e.target.value, 10);
			const post = posts[idx];
			if (!post) return;

			onChange(
				PatchEvent.from([
					set(post.title, ["title"]),
					set(post.link, ["link"]),
					set(post.pubDate, ["pubDate"]),
					set(post.excerpt, ["excerpt"]),
					post.thumbnail
						? set(post.thumbnail, ["thumbnail"])
						: unset(["thumbnail"]),
				]),
			);
		},
		[posts, onChange],
	);

	return (
		<Stack space={3}>
			{loading && (
				<Text
					size={1}
					muted
				>
					Loading blog posts…
				</Text>
			)}

			{error && (
				<Text
					size={1}
					style={{ color: "red" }}
				>
					Failed to load blog posts. Make sure the dev server is running.
				</Text>
			)}

			{!loading && !error && (
				<select
					value={selectedIndex >= 0 ? String(selectedIndex) : ""}
					onChange={handleChange}
					style={{
						width: "100%",
						padding: "8px 10px",
						borderRadius: "4px",
						border: "1px solid var(--card-border-color, #ccc)",
						background: "var(--card-bg-color, #fff)",
						color: "var(--card-fg-color, #111)",
						fontSize: "14px",
					}}
				>
					<option
						value=""
						disabled
					>
						Select a blog post…
					</option>
					{posts.map((post, i) => (
						<option
							key={post.link}
							value={String(i)}
						>
							{post.title}
						</option>
					))}
				</select>
			)}

			{currentTitle && (
				<Card
					padding={3}
					border
					radius={2}
					tone="positive"
				>
					<Stack space={2}>
						<Text
							size={1}
							weight="semibold"
						>
							{currentTitle}
						</Text>
						{currentLink && (
							<Text
								size={0}
								muted
							>
								{currentLink}
							</Text>
						)}
					</Stack>
				</Card>
			)}
		</Stack>
	);
}

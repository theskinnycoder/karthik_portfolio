"use client";

import { UploadIcon } from "@sanity/icons";
import {
	Box,
	Button,
	Card,
	Dialog,
	Flex,
	Spinner,
	Stack,
	Text,
} from "@sanity/ui";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import type {
	AssetSource,
	AssetSourceComponentProps,
	ImageAsset,
} from "sanity";

type UploadState = "idle" | "uploading" | "success" | "error";

export function VercelBlobAssetSource({
	onSelect,
	onClose,
}: AssetSourceComponentProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploadState, setUploadState] = useState<UploadState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			// Show preview
			const reader = new FileReader();
			reader.onload = (e) => setPreview(e.target?.result as string);
			reader.readAsDataURL(file);

			setUploadState("uploading");
			setError(null);

			try {
				const isStandaloneStudio = window.location.port === "3333";
				const handleUploadUrl = isStandaloneStudio
					? "http://localhost:3000/api/upload"
					: "/api/upload";

				const blob = await upload(file.name, file, {
					access: "public",
					handleUploadUrl,
				});

				setUploadState("success");

				onSelect([
					{
						kind: "url",
						value: blob.url,
						assetDocumentProps: {
							originalFilename: file.name,
							source: {
								name: "vercel-blob",
								id: blob.url,
								url: blob.url,
							},
							url: blob.url,
							_type: "sanity.imageAsset",
						} as ImageAsset,
					},
				]);
			} catch (err) {
				setUploadState("error");
				setError(err instanceof Error ? err.message : "Upload failed");
			}
		},
		[onSelect],
	);

	const handleSelectClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	return (
		<Dialog
			id="vercel-blob-asset-source"
			header="Upload to Vercel Blob"
			onClose={onClose}
			width={1}
		>
			<Box padding={4}>
				<Stack space={4}>
					<input
						ref={inputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
						onChange={handleFileChange}
						className="hidden"
					/>

					{uploadState === "idle" && (
						<Card
							padding={5}
							radius={2}
							shadow={1}
							tone="default"
							className="cursor-pointer"
							onClick={handleSelectClick}
						>
							<Flex
								direction="column"
								align="center"
								gap={3}
							>
								<UploadIcon className="size-12" />
								<Text
									size={2}
									weight="medium"
								>
									Click to select an image
								</Text>
								<Text
									size={1}
									muted
								>
									JPEG, PNG, WebP, SVG, or GIF
								</Text>
							</Flex>
						</Card>
					)}

					{uploadState === "uploading" && (
						<Card
							padding={5}
							radius={2}
							shadow={1}
						>
							<Flex
								direction="column"
								align="center"
								gap={3}
							>
								{preview && (
									<Image
										src={preview}
										alt="Preview"
										width={200}
										height={200}
										unoptimized
										className="max-h-[200px] max-w-full rounded object-contain"
									/>
								)}
								<Flex
									align="center"
									gap={2}
								>
									<Spinner />
									<Text size={2}>Uploading to Vercel Blob...</Text>
								</Flex>
							</Flex>
						</Card>
					)}

					{uploadState === "error" && (
						<Card
							padding={4}
							radius={2}
							shadow={1}
							tone="critical"
						>
							<Stack space={3}>
								<Text
									size={2}
									weight="medium"
								>
									Upload failed
								</Text>
								<Text
									size={1}
									muted
								>
									{error}
								</Text>
								<Button
									text="Try again"
									tone="primary"
									onClick={() => {
										setUploadState("idle");
										setError(null);
										setPreview(null);
									}}
								/>
							</Stack>
						</Card>
					)}

					{uploadState === "success" && (
						<Card
							padding={4}
							radius={2}
							shadow={1}
							tone="positive"
						>
							<Flex
								align="center"
								gap={2}
							>
								<Text size={2}>Upload complete! Adding to document...</Text>
							</Flex>
						</Card>
					)}
				</Stack>
			</Box>
		</Dialog>
	);
}

export const vercelBlobAssetSource = {
	name: "vercel-blob",
	title: "Vercel Blob",
	component: VercelBlobAssetSource,
	icon: UploadIcon,
} satisfies AssetSource;

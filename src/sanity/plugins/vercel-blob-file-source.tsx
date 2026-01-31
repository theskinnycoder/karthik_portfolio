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
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import type { AssetSource, AssetSourceComponentProps } from "sanity";

type UploadState = "idle" | "uploading" | "success" | "error";

export function VercelBlobFileSource({
	onSelect,
	onClose,
}: AssetSourceComponentProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploadState, setUploadState] = useState<UploadState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);

	const handleFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			setFileName(file.name);
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
							_type: "sanity.fileAsset",
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any,
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
			id="vercel-blob-file-source"
			header="Upload to Vercel Blob"
			onClose={onClose}
			width={1}
		>
			<Box padding={4}>
				<Stack space={4}>
					<input
						ref={inputRef}
						type="file"
						accept="video/mp4,video/webm,video/ogg,video/quicktime"
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
									Click to select a video
								</Text>
								<Text
									size={1}
									muted
								>
									MP4, WebM, OGG, or QuickTime
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
								{fileName && (
									<Text
										size={2}
										muted
									>
										{fileName}
									</Text>
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
										setFileName(null);
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

export const vercelBlobFileSource = {
	name: "vercel-blob-file",
	title: "Vercel Blob",
	component: VercelBlobFileSource,
	icon: UploadIcon,
} satisfies AssetSource;

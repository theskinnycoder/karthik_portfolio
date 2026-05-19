"use client";

import { Card, Flex, Text } from "@sanity/ui";
import { useCallback, useMemo, useRef, useState } from "react";
import { set } from "sanity";
import type { ArrayOfPrimitivesInputProps } from "sanity";
import {
	HOME_SECTION_KEYS,
	HOME_SECTION_LABELS,
	type HomeSectionKey,
} from "../lib/home-sections";

export function SectionOrderInput(props: ArrayOfPrimitivesInputProps) {
	const { value, onChange } = props;

	const order = useMemo<HomeSectionKey[]>(() => {
		const existing = (value ?? []) as HomeSectionKey[];
		const missing = HOME_SECTION_KEYS.filter((k) => !existing.includes(k));
		return [...existing, ...missing];
	}, [value]);

	const [dragOver, setDragOver] = useState<HomeSectionKey | null>(null);
	const draggingRef = useRef<HomeSectionKey | null>(null);

	const handleDragStart = useCallback(
		(e: React.DragEvent, key: HomeSectionKey) => {
			draggingRef.current = key;
			e.dataTransfer.effectAllowed = "move";
		},
		[],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent, key: HomeSectionKey) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
			setDragOver(key);
		},
		[],
	);

	const handleDrop = useCallback(
		(targetKey: HomeSectionKey) => {
			const from = draggingRef.current;
			if (!from || from === targetKey) {
				setDragOver(null);
				return;
			}
			const next = [...order];
			const fromIdx = next.indexOf(from);
			const toIdx = next.indexOf(targetKey);
			next.splice(fromIdx, 1);
			next.splice(toIdx, 0, from);
			onChange(set(next));
			draggingRef.current = null;
			setDragOver(null);
		},
		[order, onChange],
	);

	const handleDragEnd = useCallback(() => {
		draggingRef.current = null;
		setDragOver(null);
	}, []);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{order.map((key, index) => (
				<Card
					key={key}
					padding={3}
					radius={2}
					tone={dragOver === key ? "primary" : "default"}
					style={{
						cursor: "grab",
						userSelect: "none",
						borderTop:
							dragOver === key ? "2px solid var(--card-focus-ring-color)" : "2px solid transparent",
					}}
					draggable
					onDragStart={(e) => handleDragStart(e, key)}
					onDragOver={(e) => handleDragOver(e, key)}
					onDrop={() => handleDrop(key)}
					onDragEnd={handleDragEnd}
				>
					<Flex align="center" gap={3}>
						<Text muted size={1}>
							{index + 1}
						</Text>
						<Text
							size={1}
							muted
							style={{ letterSpacing: "0.15em", lineHeight: 1 }}
						>
							⠿⠿
						</Text>
						<Text size={2} weight="medium">
							{HOME_SECTION_LABELS[key]}
						</Text>
					</Flex>
				</Card>
			))}
		</div>
	);
}

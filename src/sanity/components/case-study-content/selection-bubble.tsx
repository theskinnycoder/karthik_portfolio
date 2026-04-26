import { useEditor, useEditorSelector } from "@portabletext/editor";
import * as selectors from "@portabletext/editor/selectors";
import {
	useDecoratorButton,
	type ToolbarDecoratorSchemaType,
} from "@portabletext/toolbar";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	WEIGHT_LABELS,
	WEIGHT_TITLES,
	type WeightDecorator,
} from "./constants";
import { useCaseStudyToolbarSchema } from "./toolbar-schema";

interface BubbleRect {
	top: number;
	left: number;
	width: number;
}

function readSelectionRect(
	editor: ReturnType<typeof useEditor>,
): BubbleRect | null {
	if (typeof window === "undefined") return null;
	const rect = editor.dom.getSelectionRect(editor.getSnapshot());
	if (!rect || (rect.width === 0 && rect.height === 0)) return null;
	return {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
		width: rect.width,
	};
}

function WeightChip({
	schemaType,
}: {
	schemaType: ToolbarDecoratorSchemaType;
}) {
	const button = useDecoratorButton({ schemaType });
	const isActive =
		button.snapshot.matches({ disabled: "active" }) ||
		button.snapshot.matches({ enabled: "active" });
	const isDisabled = button.snapshot.matches("disabled");
	const weight = schemaType.name as WeightDecorator;
	return (
		<button
			type="button"
			disabled={isDisabled}
			title={WEIGHT_TITLES[weight]}
			onMouseDown={(e) => {
				e.preventDefault();
				button.send({ type: "toggle" });
			}}
			style={{
				appearance: "none",
				border: "none",
				background: isActive ? "var(--card-fg-color, #fff)" : "transparent",
				color: isActive ? "var(--card-bg-color, #111)" : "inherit",
				padding: "4px 8px",
				fontSize: 11,
				fontWeight: 500,
				borderRadius: 4,
				cursor: isDisabled ? "not-allowed" : "pointer",
				lineHeight: 1,
				opacity: isDisabled ? 0.4 : 1,
			}}
		>
			{WEIGHT_LABELS[weight]}
		</button>
	);
}

export function SelectionBubble() {
	const editor = useEditor();
	const isExpanded = useEditorSelector(editor, selectors.isSelectionExpanded);
	const focusTextBlock = useEditorSelector(editor, selectors.getFocusTextBlock);
	const schema = useCaseStudyToolbarSchema();
	const [rect, setRect] = useState<BubbleRect | null>(null);

	const visible = isExpanded && Boolean(focusTextBlock);

	useEffect(() => {
		if (!visible) return;
		const update = () => setRect(readSelectionRect(editor));
		update();
		const id = window.requestAnimationFrame(update);
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			window.cancelAnimationFrame(id);
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [visible, editor]);

	if (!visible || !rect || typeof document === "undefined") return null;

	const weightDecorators = (schema.decorators ?? []).filter((d) =>
		d.name.startsWith("weight"),
	);

	return createPortal(
		<div
			role="toolbar"
			aria-label="Inline formatting"
			onMouseDown={(e) => e.preventDefault()}
			style={{
				position: "absolute",
				top: Math.max(rect.top - 44, 8),
				left: rect.left,
				zIndex: 200,
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "6px 10px",
				background: "var(--card-bg-color, #1a1a1a)",
				color: "var(--card-fg-color, #fff)",
				border: "1px solid rgba(255,255,255,0.08)",
				borderRadius: 8,
				boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
				fontSize: 11,
				userSelect: "none",
				whiteSpace: "nowrap",
			}}
		>
			<span style={{ opacity: 0.7 }}>Weight</span>
			<div style={{ display: "flex", gap: 2 }}>
				{weightDecorators.map((d) => (
					<WeightChip
						key={d.name}
						schemaType={d}
					/>
				))}
			</div>
		</div>,
		document.body,
	);
}

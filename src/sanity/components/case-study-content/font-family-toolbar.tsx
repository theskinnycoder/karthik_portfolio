import { useEditor, useEditorSelector } from "@portabletext/editor";
import * as selectors from "@portabletext/editor/selectors";
import { useDecoratorButton } from "@portabletext/toolbar";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FONT_OPTIONS, FONT_SCRIPT_DECORATOR } from "./constants";
import { useCaseStudyToolbarSchema } from "./toolbar-schema";

function findToolbarHost(
	editor: ReturnType<typeof useEditor>,
): HTMLElement | null {
	if (typeof window === "undefined") return null;
	const editorEl = editor.dom.getEditorElement();
	if (!editorEl) return null;
	let node: Element | null = editorEl;
	while (node) {
		const toolbar = node.querySelector<HTMLElement>(
			'[data-testid="pt-editor__toolbar-card"]',
		);
		if (toolbar) return toolbar;
		node = node.parentElement;
	}
	return null;
}

export function FontFamilyToolbar() {
	const editor = useEditor();
	const focusTextBlock = useEditorSelector(editor, selectors.getFocusTextBlock);
	const schema = useCaseStudyToolbarSchema();
	const fontScript = (schema.decorators ?? []).find(
		(d) => d.name === FONT_SCRIPT_DECORATOR,
	);
	const button = useDecoratorButton(
		fontScript
			? { schemaType: fontScript }
			: { schemaType: undefined as never },
	);
	const isScriptActive =
		button.snapshot.matches({ disabled: "active" }) ||
		button.snapshot.matches({ enabled: "active" });

	const [host, setHost] = useState<HTMLElement | null>(null);
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// The toolbar mounts asynchronously; poll a few frames, then watch for
		// re-mounts (e.g. fullscreen toggle).
		let frame = 0;
		let cancelled = false;
		const tryFind = () => {
			if (cancelled) return;
			const found = findToolbarHost(editor);
			if (found) {
				setHost((prev) => (prev === found ? prev : found));
				return;
			}
			if (frame < 30) {
				frame += 1;
				window.requestAnimationFrame(tryFind);
			}
		};
		tryFind();

		const root = editor.dom.getEditorElement()?.ownerDocument?.body;
		if (!root)
			return () => {
				cancelled = true;
			};
		const observer = new MutationObserver(() => {
			const found = findToolbarHost(editor);
			setHost((prev) => (prev === found ? prev : (found ?? null)));
		});
		observer.observe(root, { childList: true, subtree: true });
		return () => {
			cancelled = true;
			observer.disconnect();
		};
	}, [editor]);

	useEffect(() => {
		if (!open) return;
		const onClickOutside = (e: MouseEvent) => {
			const t = e.target as Node;
			if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) {
				return;
			}
			setOpen(false);
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [open]);

	if (!fontScript || !focusTextBlock || !host) return null;

	const activeValue = isScriptActive ? "script" : "sans";
	const activeOption = FONT_OPTIONS.find((o) => o.value === activeValue);

	function pick(value: (typeof FONT_OPTIONS)[number]["value"]) {
		const wantsScript = value === "script";
		if (wantsScript !== isScriptActive) {
			button.send({ type: "toggle" });
		}
		setOpen(false);
	}

	return createPortal(
		<div
			style={{
				position: "relative",
				display: "inline-flex",
				alignItems: "center",
				marginLeft: 8,
			}}
		>
			<button
				ref={triggerRef}
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					setOpen((v) => !v);
				}}
				title="Font family"
				style={{
					appearance: "none",
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					padding: "4px 8px",
					height: 27,
					border: "1px solid var(--card-border-color, rgba(255,255,255,0.1))",
					background: "transparent",
					color: "inherit",
					borderRadius: 4,
					fontSize: 12,
					cursor: "pointer",
					whiteSpace: "nowrap",
				}}
			>
				<span
					style={{
						fontFamily:
							activeValue === "script"
								? "var(--font-serif)"
								: "var(--font-sans)",
						fontStyle: activeValue === "script" ? "italic" : "normal",
					}}
				>
					Aa
				</span>
				<span style={{ opacity: 0.85 }}>
					{activeOption ? activeOption.title : "Font"}
				</span>
				<span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
			</button>
			{open ? (
				<div
					ref={menuRef}
					role="menu"
					style={{
						position: "absolute",
						top: "calc(100% + 4px)",
						left: 0,
						minWidth: 180,
						padding: 4,
						background: "var(--card-bg-color, #1a1a1a)",
						border: "1px solid var(--card-border-color, rgba(255,255,255,0.1))",
						borderRadius: 6,
						boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
						zIndex: 100,
					}}
				>
					{FONT_OPTIONS.map((opt) => {
						const isActive = opt.value === activeValue;
						return (
							<button
								key={opt.value}
								type="button"
								role="menuitemradio"
								aria-checked={isActive}
								onMouseDown={(e) => {
									e.preventDefault();
									pick(opt.value);
								}}
								style={{
									appearance: "none",
									display: "flex",
									alignItems: "center",
									gap: 8,
									width: "100%",
									padding: "6px 8px",
									border: "none",
									background: isActive
										? "rgba(255,255,255,0.06)"
										: "transparent",
									color: "inherit",
									cursor: "pointer",
									borderRadius: 4,
									fontSize: 12,
									textAlign: "left",
								}}
							>
								<span style={{ width: 12, opacity: isActive ? 1 : 0 }}>✓</span>
								<span
									style={{
										fontFamily:
											opt.value === "script"
												? "var(--font-serif)"
												: "var(--font-sans)",
									}}
								>
									{opt.title}
								</span>
								<span style={{ opacity: 0.5, marginLeft: "auto" }}>
									{opt.subtitle}
								</span>
							</button>
						);
					})}
				</div>
			) : null}
		</div>,
		host,
	);
}

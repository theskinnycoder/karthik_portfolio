"use client";

import {
	type CSSProperties,
	type ElementType,
	type FC,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export interface SplitTextProps {
	text: string;
	className?: string;
	delay?: number;
	duration?: number;
	ease?: string | ((t: number) => number);
	splitType?: "chars" | "words" | "lines" | "words, chars";
	from?: Record<string, unknown>;
	to?: Record<string, unknown>;
	threshold?: number;
	rootMargin?: string;
	startDelay?: number;
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	textAlign?: CSSProperties["textAlign"];
	onLetterAnimationComplete?: () => void;
	onLastCharStart?: () => void;
}

const SplitText: FC<SplitTextProps> = ({
	text,
	className = "",
	delay = 50,
	duration = 1.25,
	ease = "power3.out",
	splitType = "chars",
	from = { opacity: 0, y: 40 },
	to = { opacity: 1, y: 0 },
	threshold = 0.1,
	rootMargin = "-100px",
	startDelay = 0,
	tag = "p",
	textAlign = "center",
	onLetterAnimationComplete,
	onLastCharStart,
}) => {
	const ref = useRef<HTMLElement>(null);
	const animationCompletedRef = useRef(false);
	const onCompleteRef = useRef(onLetterAnimationComplete);
	const onLastCharStartRef = useRef(onLastCharStart);
	const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

	useEffect(() => {
		onCompleteRef.current = onLetterAnimationComplete;
	}, [onLetterAnimationComplete]);

	useEffect(() => {
		onLastCharStartRef.current = onLastCharStart;
	}, [onLastCharStart]);

	useEffect(() => {
		if (document.fonts.status === "loaded") {
			queueMicrotask(() => setFontsLoaded(true));
		} else {
			document.fonts.ready.then(() => setFontsLoaded(true));
		}
	}, []);

	// JSON.stringify stabilises object identity for from/to without needing deep-equal
	const fromKey = useMemo(() => JSON.stringify(from), [from]);
	const toKey = useMemo(() => JSON.stringify(to), [to]);

	useEffect(() => {
		if (!ref.current || !text || !fontsLoaded) return;
		if (animationCompletedRef.current) return;

		const el = ref.current;
		let destroyed = false;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let splitInstance: any;

		// Dynamic imports keep GSAP out of the server bundle entirely,
		// preventing Date.now() being called during Next.js cache prerender.
		Promise.all([
			import("gsap"),
			import("gsap/ScrollTrigger"),
			import("gsap/SplitText"),
		]).then(([{ gsap }, { ScrollTrigger }, { SplitText: GSAPSplitText }]) => {
			if (destroyed || !ref.current) return;

			gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

			const startPct = (1 - threshold) * 100;
			const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
			const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
			const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
			const sign =
				marginValue === 0
					? ""
					: marginValue < 0
						? `-=${Math.abs(marginValue)}${marginUnit}`
						: `+=${marginValue}${marginUnit}`;
			const start = `top ${startPct}%${sign}`;
			let targets: Element[] = [];

			splitInstance = new GSAPSplitText(el, {
				type: splitType,
				smartWrap: true,
				autoSplit: splitType === "lines",
				linesClass: "split-line",
				wordsClass: "split-word",
				charsClass: "split-char",
				reduceWhiteSpace: false,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onSplit: (self: any) => {
					if (splitType.includes("chars") && self.chars?.length)
						targets = self.chars;
					if (
						!targets.length &&
						splitType.includes("words") &&
						self.words.length
					)
						targets = self.words;
					if (
						!targets.length &&
						splitType.includes("lines") &&
						self.lines.length
					)
						targets = self.lines;
					if (!targets.length) targets = self.chars || self.words || self.lines;

					return gsap.fromTo(
						targets,
						{ ...from },
						{
							...to,
							duration,
							delay: startDelay,
							ease,
							stagger: delay / 1000,
							scrollTrigger: {
								trigger: el,
								start,
								once: true,
								fastScrollEnd: true,
								anticipatePin: 0.4,
								onEnter: () => {
									if (onLastCharStartRef.current) {
										gsap.delayedCall(
											startDelay + (targets.length - 1) * (delay / 1000),
											onLastCharStartRef.current,
										);
									}
								},
							},
							onComplete: () => {
								animationCompletedRef.current = true;
								onCompleteRef.current?.();
							},
							willChange: "transform, opacity",
							force3D: true,
						},
					);
				},
			});

			(el as HTMLElement & { _rbsplitInstance?: unknown })._rbsplitInstance =
				splitInstance;
		});

		return () => {
			destroyed = true;
			if (splitInstance) {
				import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
					ScrollTrigger.getAll().forEach((st) => {
						if (st.trigger === el) st.kill();
					});
				});
				try {
					splitInstance.revert();
				} catch {}
				(el as HTMLElement & { _rbsplitInstance?: unknown })._rbsplitInstance =
					undefined;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		text,
		delay,
		duration,
		ease,
		splitType,
		fromKey,
		toKey,
		threshold,
		rootMargin,
		fontsLoaded,
		startDelay,
	]);

	const style: CSSProperties = {
		textAlign,
		wordWrap: "break-word",
	};
	const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
	const Tag = (tag || "p") as ElementType;

	return (
		<Tag
			ref={ref as React.RefObject<HTMLElement>}
			style={style}
			className={classes}
		>
			{text}
		</Tag>
	);
};

export default SplitText;

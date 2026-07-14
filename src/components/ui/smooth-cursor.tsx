"use client";

import { motion, useSpring } from "motion/react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

interface Position {
	x: number;
	y: number;
}

export interface SmoothCursorProps {
	cursor?: React.ReactNode;
	pointerCursor?: React.ReactNode;
	springConfig?: {
		damping: number;
		stiffness: number;
		mass: number;
		restDelta: number;
	};
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isTrackablePointer(pointerType: string) {
	return pointerType !== "touch";
}

const DefaultCursorSVG: FC = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={50}
			height={54}
			viewBox="0 0 50 54"
			fill="none"
			style={{ scale: 0.5 }}
		>
			<g filter="url(#filter0_d_91_7928)">
				<path
					d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
					fill="#FFC629"
				/>
				<path
					d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
					stroke="white"
					strokeWidth={2.25825}
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_91_7928"
					x={0.602397}
					y={0.952444}
					width={49.0584}
					height={52.428}
					filterUnits="userSpaceOnUse"
					colorInterpolationFilters="sRGB"
				>
					<feFlood
						floodOpacity={0}
						result="BackgroundImageFix"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy={2.25825} />
					<feGaussianBlur stdDeviation={2.25825} />
					<feComposite
						in2="hardAlpha"
						operator="out"
					/>
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_91_7928"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_91_7928"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	);
};

// Font Awesome "hand-pointer" solid glyph (viewBox 0 0 448 512).
const HAND_POINTER_PATH =
	"M128 40c0-22.1 17.9-40 40-40s40 17.9 40 40V188.2c8.5-7.6 19.7-12.2 32-12.2c25.3 0 46 19.5 47.9 44.3c8.5-7.7 19.8-12.3 32.1-12.3c25.3 0 46 19.5 47.9 44.3c8.5-7.7 19.8-12.3 32.1-12.3c26.5 0 48 21.5 48 48v32 64c0 70.7-57.3 128-128 128l-16 0H240l-.1 0h-5.2c-5 0-9.9-.3-14.7-1c-55.3-5.6-106.2-34-140-79L8 336c-13.3-17.7-9.7-42.7 8-56s42.7-9.7 56 8l56 74.7V40zM240 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z";

const PointerCursorSVG: FC = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={42}
			height={48}
			viewBox="0 0 448 512"
			fill="none"
			style={{ scale: 0.5 }}
		>
			<g filter="drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.3))">
				<path
					d={HAND_POINTER_PATH}
					fill="#FFC629"
				/>
				<path
					d={HAND_POINTER_PATH}
					stroke="white"
					strokeWidth={14}
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
};

function isInteractiveTarget(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	const interactive = target.closest(
		'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor-pointer]',
	);

	if (interactive) {
		return true;
	}

	return getComputedStyle(target).cursor === "pointer";
}

export function SmoothCursor({
	cursor = <DefaultCursorSVG />,
	pointerCursor = <PointerCursorSVG />,
	springConfig = {
		damping: 60,
		stiffness: 900,
		mass: 1,
		restDelta: 0.001,
	},
}: SmoothCursorProps) {
	const lastMousePos = useRef<Position>({ x: 0, y: 0 });
	const velocity = useRef<Position>({ x: 0, y: 0 });
	// 0 instead of Date.now(): avoids reading the clock during render (which
	// Cache Components flags as needing a Suspense boundary). The first
	// pointermove after mount just computes a large, harmless deltaTime.
	const lastUpdateTime = useRef(0);
	const previousAngle = useRef(0);
	const accumulatedRotation = useRef(0);
	const [isEnabled, setIsEnabled] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isPointerTarget, setIsPointerTarget] = useState(false);

	const cursorX = useSpring(0, springConfig);
	const cursorY = useSpring(0, springConfig);
	const rotation = useSpring(0, {
		...springConfig,
		damping: 70,
		stiffness: 500,
	});
	const scale = useSpring(1, {
		...springConfig,
		stiffness: 500,
		damping: 35,
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);

		const updateEnabled = () => {
			const nextIsEnabled = mediaQuery.matches;
			setIsEnabled(nextIsEnabled);

			if (!nextIsEnabled) {
				setIsVisible(false);
			}
		};

		updateEnabled();
		mediaQuery.addEventListener("change", updateEnabled);

		return () => {
			mediaQuery.removeEventListener("change", updateEnabled);
		};
	}, []);

	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		let timeout: ReturnType<typeof setTimeout> | null = null;

		const updateVelocity = (currentPos: Position) => {
			const currentTime = Date.now();
			const deltaTime = currentTime - lastUpdateTime.current;

			if (deltaTime > 0) {
				velocity.current = {
					x: (currentPos.x - lastMousePos.current.x) / deltaTime,
					y: (currentPos.y - lastMousePos.current.y) / deltaTime,
				};
			}

			lastUpdateTime.current = currentTime;
			lastMousePos.current = currentPos;
		};

		let wasPointerTarget = false;

		const smoothPointerMove = (e: PointerEvent) => {
			if (!isTrackablePointer(e.pointerType)) {
				return;
			}

			setIsVisible(true);

			const nextIsPointerTarget = isInteractiveTarget(e.target);
			if (nextIsPointerTarget !== wasPointerTarget) {
				wasPointerTarget = nextIsPointerTarget;
				setIsPointerTarget(nextIsPointerTarget);
			}

			const currentPos = { x: e.clientX, y: e.clientY };
			updateVelocity(currentPos);

			const speed = Math.sqrt(
				velocity.current.x ** 2 + velocity.current.y ** 2,
			);

			cursorX.set(currentPos.x);
			cursorY.set(currentPos.y);

			if (speed > 0.1) {
				const currentAngle =
					Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
					90;

				let angleDiff = currentAngle - previousAngle.current;
				if (angleDiff > 180) angleDiff -= 360;
				if (angleDiff < -180) angleDiff += 360;
				accumulatedRotation.current += angleDiff;
				rotation.set(accumulatedRotation.current);
				previousAngle.current = currentAngle;

				scale.set(0.95);

				if (timeout !== null) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(() => {
					scale.set(1);
				}, 150);
			}
		};

		let rafId = 0;
		const throttledPointerMove = (e: PointerEvent) => {
			if (!isTrackablePointer(e.pointerType)) {
				return;
			}

			if (rafId) return;

			rafId = requestAnimationFrame(() => {
				smoothPointerMove(e);
				rafId = 0;
			});
		};

		// `body.style.cursor` alone doesn't reach descendants that set their
		// own `cursor` (native <a> tags, Tailwind's cursor-pointer, etc.) —
		// those override the inherited value. Force it everywhere instead.
		const styleEl = document.createElement("style");
		styleEl.textContent = "* { cursor: none !important; }";
		document.head.appendChild(styleEl);

		window.addEventListener("pointermove", throttledPointerMove, {
			passive: true,
		});

		return () => {
			window.removeEventListener("pointermove", throttledPointerMove);
			styleEl.remove();
			if (rafId) cancelAnimationFrame(rafId);
			if (timeout !== null) {
				clearTimeout(timeout);
			}
		};
	}, [cursorX, cursorY, rotation, scale, isEnabled]);

	if (!isEnabled) {
		return null;
	}

	return (
		<motion.div
			style={{
				position: "fixed",
				left: cursorX,
				top: cursorY,
				translateX: "-50%",
				translateY: "-50%",
				scale: scale,
				zIndex: 100,
				pointerEvents: "none",
				willChange: "transform",
				opacity: isVisible ? 1 : 0,
			}}
			initial={false}
			animate={{ opacity: isVisible ? 1 : 0 }}
			transition={{
				duration: 0.15,
			}}
		>
			{isPointerTarget ? (
				pointerCursor
			) : (
				<motion.div style={{ rotate: rotation }}>{cursor}</motion.div>
			)}
		</motion.div>
	);
}

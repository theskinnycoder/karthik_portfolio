import { type BlockDecoratorRenderProps } from "@portabletext/editor";
import {
	FONT_SCRIPT_DECORATOR,
	WEIGHT_DECORATORS,
	WEIGHT_LABELS,
	WEIGHT_VALUES,
	type WeightDecorator,
} from "./constants";

function makeWeightDecoratorComponent(weight: WeightDecorator) {
	return function WeightDecoratorComponent(
		props: BlockDecoratorRenderProps,
	): React.ReactElement {
		return (
			<span style={{ fontWeight: WEIGHT_VALUES[weight] }}>
				{props.children}
			</span>
		);
	};
}

function makeWeightDecoratorIcon(weight: WeightDecorator) {
	return function WeightDecoratorIcon(): React.ReactElement {
		return (
			<span
				style={{
					fontSize: 11,
					fontWeight: WEIGHT_VALUES[weight],
					letterSpacing: "-0.02em",
				}}
			>
				{WEIGHT_LABELS[weight]}
			</span>
		);
	};
}

export const weightDecoratorRenderers = Object.fromEntries(
	WEIGHT_DECORATORS.map((w) => [w, makeWeightDecoratorComponent(w)]),
) as Record<
	WeightDecorator,
	(props: BlockDecoratorRenderProps) => React.ReactElement
>;

export const weightDecoratorIcons = Object.fromEntries(
	WEIGHT_DECORATORS.map((w) => [w, makeWeightDecoratorIcon(w)]),
) as Record<WeightDecorator, () => React.ReactElement>;

export function FontScriptDecorator(
	props: BlockDecoratorRenderProps,
): React.ReactElement {
	return (
		<span style={{ fontFamily: "var(--font-serif)" }}>{props.children}</span>
	);
}

export function FontScriptIcon(): React.ReactElement {
	return (
		<span
			style={{
				fontFamily: "var(--font-serif)",
				fontSize: 14,
				fontStyle: "italic",
			}}
		>
			Aa
		</span>
	);
}

export { FONT_SCRIPT_DECORATOR };

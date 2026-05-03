import { type BlockDecoratorRenderProps } from "@portabletext/editor";
import {
	COLOR_DECORATORS,
	COLOR_TOKENS,
	type ColorDecorator,
} from "./constants";

function makeColorDecoratorComponent(decorator: ColorDecorator) {
	const cssVar = COLOR_TOKENS[decorator];
	return function ColorDecoratorComponent(
		props: BlockDecoratorRenderProps,
	): React.ReactElement {
		return <span style={{ color: `var(${cssVar})` }}>{props.children}</span>;
	};
}

function makeColorDecoratorIcon(decorator: ColorDecorator) {
	const cssVar = COLOR_TOKENS[decorator];
	return function ColorDecoratorIcon(): React.ReactElement {
		return (
			<span
				aria-hidden
				style={{
					display: "inline-block",
					width: 12,
					height: 12,
					borderRadius: "50%",
					backgroundColor: `var(${cssVar})`,
					border: "1px solid currentColor",
				}}
			/>
		);
	};
}

export const colorDecoratorRenderers = Object.fromEntries(
	COLOR_DECORATORS.map((c) => [c, makeColorDecoratorComponent(c)]),
) as Record<
	ColorDecorator,
	(props: BlockDecoratorRenderProps) => React.ReactElement
>;

export const colorDecoratorIcons = Object.fromEntries(
	COLOR_DECORATORS.map((c) => [c, makeColorDecoratorIcon(c)]),
) as Record<ColorDecorator, () => React.ReactElement>;

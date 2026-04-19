export const FONT_WEIGHT_DECORATOR_VALUES = [
	"fontRegular",
	"fontMedium",
	"fontSemibold",
	"fontBold",
] as const;

export type FontWeightDecoratorValue =
	(typeof FONT_WEIGHT_DECORATOR_VALUES)[number];

export const fontWeightDecorators: ReadonlyArray<{
	title: string;
	value: FontWeightDecoratorValue;
}> = [
	{ title: "Regular", value: "fontRegular" },
	{ title: "Medium", value: "fontMedium" },
	{ title: "Semibold", value: "fontSemibold" },
	{ title: "Bold", value: "fontBold" },
];

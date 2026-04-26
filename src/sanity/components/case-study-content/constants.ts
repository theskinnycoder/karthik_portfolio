export const WEIGHT_DECORATORS = [
	"weight300",
	"weight400",
	"weight500",
	"weight600",
	"weight700",
] as const;

export type WeightDecorator = (typeof WEIGHT_DECORATORS)[number];

export const WEIGHT_LABELS: Record<WeightDecorator, string> = {
	weight300: "300",
	weight400: "400",
	weight500: "500",
	weight600: "600",
	weight700: "700",
};

export const WEIGHT_TITLES: Record<WeightDecorator, string> = {
	weight300: "Light 300",
	weight400: "Regular 400",
	weight500: "Medium 500",
	weight600: "Semibold 600",
	weight700: "Bold 700",
};

export const WEIGHT_VALUES: Record<WeightDecorator, number> = {
	weight300: 300,
	weight400: 400,
	weight500: 500,
	weight600: 600,
	weight700: 700,
};

export const FONT_SCRIPT_DECORATOR = "fontScript" as const;

export const FONT_OPTIONS = [
	{ value: "sans", title: "Inter Tight", subtitle: "(sans)" },
	{ value: "script", title: "Caveat", subtitle: "(script)" },
] as const;

export type FontOption = (typeof FONT_OPTIONS)[number]["value"];

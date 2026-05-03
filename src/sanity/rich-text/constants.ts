/**
 * Decorator name → CSS variable token. Inline `style={{ color: 'var(--…)' }}`
 * resolves the same token in the Studio (loaded via Next.js at /studio) and on
 * the site, and auto-flips for the warm-light theme on /work/[slug].
 */
export const COLOR_DECORATORS = [
	"colorForeground",
	"colorParagraph",
	"colorMuted",
	"colorAccent",
] as const;

export type ColorDecorator = (typeof COLOR_DECORATORS)[number];

export const COLOR_TOKENS: Record<ColorDecorator, string> = {
	colorForeground: "--foreground",
	colorParagraph: "--paragraph",
	colorMuted: "--muted-foreground",
	colorAccent: "--accent-coral",
};

export const COLOR_TITLES: Record<ColorDecorator, string> = {
	colorForeground: "Foreground",
	colorParagraph: "Paragraph",
	colorMuted: "Muted",
	colorAccent: "Accent",
};

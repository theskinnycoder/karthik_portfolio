import { Caveat, Geist_Mono, Inter_Tight } from "next/font/google";

export const interFont = Inter_Tight({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const geistMonoFont = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const caveatFont = Caveat({
	variable: "--font-serif",
	subsets: ["latin"],
});

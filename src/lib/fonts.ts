import { Caveat, Inter_Tight } from "next/font/google";

export const interFont = Inter_Tight({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const caveatFont = Caveat({
	variable: "--font-serif",
	subsets: ["latin"],
});

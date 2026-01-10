import { Geist_Mono, Inter } from "next/font/google";

export const interFont = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const geistMonoFont = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

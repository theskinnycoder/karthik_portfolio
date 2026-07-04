import { ImageResponse } from "next/og";

export const alt = "Karthik Panchala — Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					justifyContent: "center",
					backgroundColor: "#000000",
					padding: "80px",
					fontFamily: "sans-serif",
				}}
			>
				<div style={{ display: "flex", fontSize: 72, fontWeight: 600, color: "#FFFFFF" }}>
					Karthik Panchala
				</div>
				<div
					style={{
						display: "flex",
						fontSize: 56,
						fontWeight: 600,
						backgroundImage: "linear-gradient(90deg, #FBBA27, #FB7481)",
						backgroundClip: "text",
						WebkitBackgroundClip: "text",
						color: "transparent",
						marginTop: 12,
					}}
				>
					Product Designer
				</div>
				<div style={{ display: "flex", fontSize: 28, color: "#A1A1AA", marginTop: 32 }}>
					B2B SaaS &amp; AI-powered products
				</div>
			</div>
		),
		{ ...size },
	);
}

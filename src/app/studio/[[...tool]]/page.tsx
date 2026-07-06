import { NextStudio } from "next-sanity/studio";
import { connection } from "next/server";
import { Suspense } from "react";
import config from "../../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

async function Studio() {
	await connection();
	return <NextStudio config={config} />;
}

export default function StudioPage() {
	return (
		<Suspense>
			<Studio />
		</Suspense>
	);
}

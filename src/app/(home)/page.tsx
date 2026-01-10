"use cache";

import { ProfileInfo } from "./_components/profile-info";

export default async function Page() {
	return (
		<main className="mx-auto flex w-full max-w-2xl px-6 py-16">
			<ProfileInfo />
		</main>
	);
}

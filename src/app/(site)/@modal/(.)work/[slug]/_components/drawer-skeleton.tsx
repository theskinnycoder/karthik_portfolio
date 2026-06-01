export function DrawerSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-6 pt-10 pb-24">
			{[100, 70, 90, 50, 80, 60, 100, 75].map((w, i) => (
				<div
					key={i}
					className="h-5 animate-pulse rounded-md bg-foreground/10"
					style={{ width: `${w}%` }}
				/>
			))}
		</div>
	);
}

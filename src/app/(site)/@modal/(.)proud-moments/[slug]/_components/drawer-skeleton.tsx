export function DrawerSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-6 pt-10 pb-24">
			{/* Hero placeholder */}
			<div className="-mx-6 aspect-[16/10] w-[calc(100%+3rem)] animate-pulse bg-foreground/10 md:mx-0 md:w-full md:rounded-2xl" />
			{[60, 90, 70, 100, 50, 80].map((w, i) => (
				<div
					key={i}
					className="h-5 animate-pulse rounded-md bg-foreground/10"
					style={{ width: `${w}%` }}
				/>
			))}
		</div>
	);
}

import { cn } from "@/lib/utils";

interface AboutSectionProps {
	className?: string;
}

function Highlight({ children }: { children: React.ReactNode }) {
	return <span className="font-medium text-foreground">{children}</span>;
}

export function AboutSection({ className }: AboutSectionProps) {
	return (
		<div
			className={cn(
				"space-y-3 text-base font-light text-muted-foreground",
				className,
			)}
		>
			<p>
				Hello, there! My name is <Highlight>Karthik</Highlight>, and I&apos;m a{" "}
				<Highlight>Product Designer</Highlight> based in Hyderabad. I love
				exploring SaaS dashboards, finding and fixing flow issues and creating a
				smoother experience for users.
			</p>
			<p>
				In my 2 years of experience, I&apos;ve designed user interfaces and
				experiences, planned and supported product features and roadmaps, and
				led cross-functional teams. I&apos;ve worked at{" "}
				<Highlight>Apxor</Highlight> and have also consulted for{" "}
				<Highlight>Hearzap</Highlight> and <Highlight>Eclaire</Highlight>.
			</p>
			<p>
				I&apos;m currently open to new opportunities, so if you think I&apos;d
				be a great fit, feel free to reach out!
			</p>
		</div>
	);
}

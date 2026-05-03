import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const companyBadgeVariants = cva(
	"h-auto rounded-full border-border bg-card font-medium",
	{
		variants: {
			tone: {
				current: "px-3.5 py-2 text-sm",
				past: "px-3 py-1.5 text-xs text-muted-foreground",
			},
		},
		defaultVariants: {
			tone: "past",
		},
	},
);

interface CompanyBadgeProps extends VariantProps<typeof companyBadgeVariants> {
	children: ReactNode;
	className?: string;
}

export function CompanyBadge({ tone, children, className }: CompanyBadgeProps) {
	return (
		<Badge className={cn(companyBadgeVariants({ tone }), className)}>
			{tone === "current" ? (
				<span className="bg-gradient-to-b from-[#c8ed97] to-[#47d9b8] bg-clip-text text-transparent">
					{children}
				</span>
			) : (
				children
			)}
		</Badge>
	);
}

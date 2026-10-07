import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type LockTooltipProps = {
	reason?: string;
	children: ReactNode;
};

/** Explains why the wrapped (disabled) control is locked. Renders children as-is when there is no reason. */
export function LockTooltip({ reason, children }: LockTooltipProps) {
	if (!reason) return <>{children}</>;

	// Disabled buttons don't fire pointer events, so the tooltip hangs on a wrapper.
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="inline-flex">
					{children}
				</span>
			</TooltipTrigger>
			<TooltipContent>{reason}</TooltipContent>
		</Tooltip>
	);
}

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { ContestNames, type Contests } from "@/types/Contestant";

const configs = [
	{ key: "orderConfig", label: "Order Config" },
	{ key: "platformConfig", label: "Platform Config" },
	{ key: "timeConfig", label: "Time Config" },
] as const;

const enrichKeys = (obj: unknown, translateValues = false): unknown => {
	if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
	return Object.fromEntries(
		Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
			const isContest = ContestNames.has(Number(k) as Contests);
			const newKey = isContest ? `Konkurencja - ${k}` : k;
			const newValue =
				translateValues && typeof v === "number"
					? (ContestNames.get(v as Contests) ?? v)
					: v;
			return [newKey, newValue];
		}),
	);
};

export default function ConfigsPreview() {
	const { compInfo } = useCompetitionContext();

	const handleCopy = (key: string, value: unknown) => {
		navigator.clipboard.writeText(JSON.stringify(enrichKeys(value, key === "orderConfig"), null, 2));
		toast.success(`Skopiowano ${key}`);
	};

	return (
		<div className="flex flex-col gap-4 p-4">
			{configs.map(({ key, label }) => {
				const value = compInfo[key as keyof typeof compInfo];
				return (
					<div key={key} className="flex flex-col gap-1">
						<div className="flex items-center justify-between">
							<span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
								{label}
							</span>
							<Button
								size="icon"
								variant="ghost"
								className="h-6 w-6"
								onClick={() => handleCopy(key, value)}>
								<Copy className="h-3 w-3" />
							</Button>
						</div>
						<pre className="rounded-md border bg-muted/50 p-3 text-xs overflow-auto max-h-48 font-mono">
							{JSON.stringify(enrichKeys(value, key === "orderConfig"), null, 2)}
						</pre>
					</div>
				);
			})}
		</div>
	);
}

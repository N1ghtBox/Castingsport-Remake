import { Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { useMenuContext } from "@/context/menu/MenuContext";
import type { Series } from "@/types/Series";
import { deleteSummary } from "@/utils/jsonUtils";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "./context-menu";

type SeriesCardProps = {
	series: Series;
	refresh: () => Promise<void>;
};

export default function SeriesCard({ series, refresh }: SeriesCardProps) {
	const { competitions } = useMenuContext();
	const navigate = useNavigate();

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Card
					className="@container/card hover:cursor-pointer"
					onClick={() => navigate(`/serie/${series.id}/summary/1/5`)}>
					<CardHeader className="relative">
						<CardDescription>Cykl</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{series.name}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Lista zawodów
						</div>
						<div className="text-muted-foreground">
							<ul>
								{series.competitionIds.map((id) => {
									const comp = competitions.find((x) => x.id === id);
									if (!comp) return "";
									return <li key={id}>{comp.name}</li>;
								})}
							</ul>
						</div>
					</CardFooter>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuSeparator />
				<ContextMenuItem
					variant="destructive"
					onClick={async () => {
						await deleteSummary(series.id);
						await refresh();
					}}>
					<Trash />
					Usuń
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

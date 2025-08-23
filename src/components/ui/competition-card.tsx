import type Competition from "@/types/Competition";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";
import { useNavigate } from "react-router";
import moment from "moment";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Settings, Trash } from "lucide-react";
import { deleteComp } from "@/utils/jsonUtils";

type CompetitionCardProps = {
	competition: Competition;
	refresh: () => Promise<void>
};

export default function CompetitionCard({ competition, refresh }: CompetitionCardProps) {
	const navigate = useNavigate();

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Card
					className="@container/card hover:cursor-pointer"
					onClick={() => navigate(`/competition/${competition.id}`)}>
					<CardHeader className="relative">
						<CardDescription>Zawody</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
							{competition.name}
						</CardTitle>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							{competition.place}
						</div>
						<div className="text-muted-foreground">
							{moment(competition.dateFrom).format("LL")} -{" "}
							{moment(competition.dateTo).format("LL")}
						</div>
					</CardFooter>
				</Card>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem><Settings /> Edytuj</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive" onClick={async () => {
					await deleteComp(competition.id)
					await refresh()
				}}>
					<Trash />Usuń
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

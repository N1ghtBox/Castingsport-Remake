"use client";

import { Settings, Trash } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Competition } from "@/types/Competition";
import { deleteComp } from "@/utils/jsonUtils";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./dropdown-menu";

type CompetitionCardProps = {
	competition: Competition;
	refresh: () => Promise<void>;
	onEdit: (id: string) => void;
};

export default function CompetitionCard({
	competition,
	refresh,
	onEdit,
}: CompetitionCardProps) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setPosition({ x: e.clientX, y: e.clientY });
		setOpen(true);
	};

	return (
		<>
			<div onContextMenu={handleContextMenu}>
				<Card
					className="@container/card hover:cursor-pointer"
					onClick={() => navigate(`/competition/${competition.id}`)}
				>
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
			</div>

			{open && (
				<DropdownMenu open={open} onOpenChange={setOpen}>
					{/* Invisible trigger at cursor */}
					<DropdownMenuTrigger asChild>
						<div
							style={{
								position: "fixed",
								top: position.y,
								left: position.x,
								width: 0,
								height: 0,
							}}
						/>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side="right"
						sideOffset={4}
						align="start"
						className="w-48 p-1"
					>
						<DropdownMenuItem
							onSelect={() => {
								setOpen(false);
								onEdit(competition.id);
							}}
						>
							<Settings className="mr-2 h-4 w-4" />
							Edytuj
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="text-destructive"
							onSelect={async () => {
								setOpen(false);
								await deleteComp(competition.id);
								await refresh();
							}}
						>
							<Trash className="mr-2 h-4 w-4" />
							Usuń
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}
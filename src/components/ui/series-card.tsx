"use client";

import { Settings, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./dropdown-menu";

type SeriesCardProps = {
	series: Series;
	refresh: () => Promise<void>;
	onEdit: (id: string) => void;
};

export default function SeriesCard({ series, refresh, onEdit }: SeriesCardProps) {
	const { competitions } = useMenuContext();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setPosition({ x: e.clientX, y: e.clientY });
		setOpen(true);
	};

	return (
		<>
			<div
				ref={triggerRef}
				onContextMenu={handleContextMenu}
				className="inline-block w-full"
			>
				<Card
					className="@container/card hover:cursor-pointer"
					onClick={() => navigate(`/serie/${series.id}/summary/1/5`)}
				>
					<CardHeader>
						<CardDescription>{t("seriesCard.prefix")}{series.type}</CardDescription>
						<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
							{series.name}
						</CardTitle>
					</CardHeader>

					<CardFooter className="flex-col items-start gap-1 text-sm">
						<div className="line-clamp-1 font-medium">{t("seriesCard.listOfCompetitions")}</div>
						<ul className="text-muted-foreground">
							{series.competitionIds.map((id) => {
								const comp = competitions.find((x) => x.id === id);
								if (!comp) return null;
								return <li key={id}>{comp.name}</li>;
							})}
						</ul>
					</CardFooter>
				</Card>
			</div>

			{open && (
				<DropdownMenu open={open} onOpenChange={setOpen}>
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
								onEdit(series.id);
							}}
						>
							<Settings className="mr-2 h-4 w-4" />
							{t("seriesCard.edit")}
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							className="text-destructive"
							onSelect={async () => {
								setOpen(false);
								await deleteSummary(series.id);
								await refresh();
							}}
						>
							<Trash className="mr-2 h-4 w-4" />
							{t("seriesCard.delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}

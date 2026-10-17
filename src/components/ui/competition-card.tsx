"use client";

import {
	Ban,
	CircleCheck,
	type LucideIcon,
	Play,
	RotateCcw,
	Settings,
	Trash,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
	type Competition,
	CompetitionStatus,
	getCompetitionStatus,
} from "@/types/Competition";
import { deleteComp, updateCompStatus } from "@/utils/jsonUtils";
import { Badge } from "./badge";
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

const statusBadgeVariant: Record<
	CompetitionStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	[CompetitionStatus.NotStarted]: "outline",
	[CompetitionStatus.InProgress]: "default",
	[CompetitionStatus.Closed]: "secondary",
	[CompetitionStatus.Cancelled]: "destructive",
};

type StatusAction = {
	to: CompetitionStatus;
	label: string;
	icon: LucideIcon;
};

const startAction: StatusAction = { to: CompetitionStatus.InProgress, label: "start", icon: Play };
const closeAction: StatusAction = { to: CompetitionStatus.Closed, label: "close", icon: CircleCheck };
const cancelAction: StatusAction = { to: CompetitionStatus.Cancelled, label: "cancel", icon: Ban };
const reopenAction: StatusAction = { to: CompetitionStatus.InProgress, label: "reopen", icon: RotateCcw };
const restoreAction: StatusAction = { to: CompetitionStatus.NotStarted, label: "restore", icon: RotateCcw };

const statusActions: Record<CompetitionStatus, StatusAction[]> = {
	[CompetitionStatus.NotStarted]: [startAction, cancelAction],
	[CompetitionStatus.InProgress]: [closeAction, cancelAction],
	[CompetitionStatus.Closed]: [reopenAction],
	[CompetitionStatus.Cancelled]: [restoreAction],
};

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
	const { t } = useTranslation();
	const status = getCompetitionStatus(competition);

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
						<CardDescription>{t("competitionCard.label")}</CardDescription>
						<Badge
							variant={statusBadgeVariant[status]}
							className="absolute top-0 right-6">
							{t(`competitionStatus.${status}`)}
						</Badge>
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
							{t("competitionCard.edit")}
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{statusActions[status].map(({ to, label, icon: Icon }) => (
							<DropdownMenuItem
								key={label}
								onSelect={async () => {
									setOpen(false);
									await updateCompStatus(competition.id, to);
									await refresh();
								}}
							>
								<Icon className="mr-2 h-4 w-4" />
								{t(`competitionCard.status.${label}`)}
							</DropdownMenuItem>
						))}

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
							{t("competitionCard.delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}

import { PlusIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import CompetitionForm from "@/components/ui/comp-form";
import CompetitionCard from "@/components/ui/competition-card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useMenuContext } from "@/context/menu/MenuContext";

export default function CompetitionList() {
	const year = useLoaderData<number>();
	const [editId, setEditId] = useState<string>();
	const [open, setOpen] = useState(false);
	const { competitions, refresh } = useMenuContext();
	const navigate = useNavigate();
	const { t } = useTranslation();

	function AfterCreate(id: string) {
		navigate(`/competition/${id}`);
	}

	async function AfterEdit() {
		setEditId(undefined);
		setOpen(false);
		await refresh();
	}

	const filteredCompetitions = useMemo(() => {
		return competitions.filter((x) => {
			const date = moment(x.dateFrom);
			if (!date.isValid()) return false;
			return date.year() === year;
		});
	}, [year, competitions]);

	return (
		<>
			<span className="m-3 flex gap-1.5">
				<Dialog
					open={open}
					onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button color="primary">
							<PlusIcon />
							{t("common.add")}
						</Button>
					</DialogTrigger>
					<DialogContent
						onInteractOutside={(e) => {
							e.preventDefault();
						}}>
						<DialogHeader>
							<DialogTitle>
								{editId ? t("dialog.editCompetition") : t("dialog.createCompetition")}
							</DialogTitle>
						</DialogHeader>
						<CompetitionForm
							editCallback={AfterEdit}
							callback={AfterCreate}
							editId={editId}
						/>
					</DialogContent>
				</Dialog>
			</span>
			<div className=" grid grid-cols-2 @5xl/main:grid-cols-4 max-h-3/4 gap-4 px-3.75 overflow-y-auto">
				{[...filteredCompetitions].map((comp) => {
					return (
						<CompetitionCard
							key={comp.id}
							competition={comp}
							refresh={refresh}
							onEdit={(id) => {
								setEditId(id);
								setOpen(true);
							}}
						/>
					);
				})}
			</div>
		</>
	);
}

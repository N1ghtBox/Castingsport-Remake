import { FileUp, PlusIcon } from "lucide-react";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";
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
import type { CompetitionExportData } from "@/types/JsonData";
import { parseCompFile } from "@/utils/jsonUtils";

export default function CompetitionList() {
	const year = useLoaderData<number>();
	const [editId, setEditId] = useState<string>();
	const [importData, setImportData] = useState<CompetitionExportData>();
	const [open, setOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
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

	function onOpenChange(value: boolean) {
		if (!value) setImportData(undefined);
		setOpen(value);
	}

	async function onImportFile(file: File | undefined) {
		if (!file) return;

		const data = parseCompFile(await file.text());
		if (!data) {
			toast.error(t("dialog.invalidCompetitionFile"));
			return;
		}

		setEditId(undefined);
		setImportData(data);
		setOpen(true);
	}

	const filteredCompetitions = useMemo(() => {
		return competitions.filter((x) => {
			const date = moment(x.dateFrom);
			if (!date.isValid()) return false;
			return date.year() === year;
		});
	}, [year, competitions]);

	const dialogTitle = editId
		? t("dialog.editCompetition")
		: importData
			? t("dialog.importCompetition")
			: t("dialog.createCompetition");

	return (
		<>
			<span className="m-3 flex gap-1.5">
				<Dialog
					open={open}
					onOpenChange={onOpenChange}>
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
							<DialogTitle>{dialogTitle}</DialogTitle>
						</DialogHeader>
						<CompetitionForm
							editCallback={AfterEdit}
							callback={AfterCreate}
							editId={editId}
							importData={importData}
						/>
					</DialogContent>
				</Dialog>
				<Button
					variant="outline"
					onClick={() => fileInputRef.current?.click()}>
					<FileUp />
					{t("common.import")}
				</Button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json,application/json"
					className="hidden"
					onChange={async (e) => {
						const input = e.currentTarget;
						await onImportFile(input.files?.[0]);
						// Reset so picking the same file again still triggers onChange.
						input.value = "";
					}}
				/>
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

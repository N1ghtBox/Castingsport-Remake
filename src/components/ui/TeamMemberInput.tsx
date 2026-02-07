import type { GridRenderEditCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { Categories, type Contestant } from "@/types/Contestant";
import type Team from "@/types/Teams";
import { TeamCategory } from "@/types/Teams";
import { Button } from "./button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import TeamMemberSelector from "./TeamMemberSelector";

type TeamMemberInputProps = GridRenderEditCellParams<Team & { isNew: boolean }>;

const TeamMemberInput = (params: TeamMemberInputProps) => {
	const [open, setOpen] = useState(false);
	const { contestants } = useCompetitionContext();
	const [internalValues, setInternalValues] = useState<Array<Contestant["id"]>>(
		[],
	);

	useEffect(() => {
		if (params.hasFocus) setOpen(true);
	}, [params.hasFocus]);

	useEffect(() => {
		setInternalValues(params.row.members);
	}, [params.row.members]);

	const filterByCategory = (contestant: Contestant) => {
		const category = params.row.category;

		if (category !== TeamCategory.Junior) return true;
		return (
			contestant.category !== Categories.Man &&
			contestant.category !== Categories.Kobieta
		);
	};

	const filterByExistingTeams = useMemo(() => {
		const rowIds = params.api.getAllRowIds();
		let userInTeams: string[] = [];

		for (const rowId of rowIds) {
			const row = params.api.getRow<Team>(rowId);

			if (row) userInTeams = [...userInTeams, ...row.members];
		}

		return (contestant: Contestant) =>
			!userInTeams.includes(contestant.id) ||
			params.row.members.includes(contestant.id);
	}, [params]);

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => setOpen(val)}>
			<DialogTrigger>
				{params.row.memberNames.length > 0
					? params.row.memberNames.join(", ")
					: "Brak zawodników"}
			</DialogTrigger>
			<DialogContent style={{ width: "fit-content" }}>
				<DialogTitle>Dodaj zawodników do drużyny</DialogTitle>
				<TeamMemberSelector
					values={internalValues}
					contestants={params.contestants
						.filter(filterByCategory)
						.filter(filterByExistingTeams)}
					onChange={(ids) => setInternalValues(ids)}
				/>
				<DialogFooter>
					<Button
						type="submit"
						onClick={async () => {
							await params.api.setEditCellValue({
								...params,
								field: "memberNames",
								value: contestants
									.filter((cont) => internalValues.includes(cont.id))
									.map((x) => x.name),
							});

							await params.api.setEditCellValue({
								...params,
								field: "members",
								value: [...internalValues],
							});

							setOpen(false);
						}}>
						Zapisz zmiany
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TeamMemberInput;

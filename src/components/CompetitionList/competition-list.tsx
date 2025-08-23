import { MenuListContext } from "@/BaseLayout";
import moment from "moment";
import { useContext, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import CompetitionCard from "../ui/competition-card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import CompetitionForm from "../ui/comp-form";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

export default function CompetitionList() {
	const year = useLoaderData<number>();
	const { competitions, refresh } = useContext(MenuListContext);
	const navigate = useNavigate();

	function AfterCreate(id: string) {
		navigate(`/competition/${id}`);
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
			<span className="m-[12px] flex gap-1.5">
				<Dialog>
					<DialogTrigger asChild>
						<Button color="primary">
							<PlusIcon />
							Dodaj
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Utwórz zawody</DialogTitle>
						</DialogHeader>
						<CompetitionForm callback={AfterCreate} />
					</DialogContent>
				</Dialog>
			</span>
			<div className=" grid grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-[15px]">
				{[...filteredCompetitions].map((comp) => {
					return (
						<CompetitionCard
							key={comp.id}
							competition={comp}
							refresh={refresh}
						/>
					);
				})}
			</div>
		</>
	);
}

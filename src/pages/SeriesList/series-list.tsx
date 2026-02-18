import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import SeriesCard from "@/components/ui/series-card";
import SeriesForm from "@/components/ui/series-form";
import { useMenuContext } from "@/context/menu/MenuContext";
import { PathProvider } from "@/providers/PathProvider/provider";

export default function SeriesList() {
	const year = useLoaderData<number>();
	const [editId, setEditId] = useState<string>();
	const [open, setOpen] = useState(false);
	const { series, refresh } = useMenuContext();
	const navigate = useNavigate();

	function AfterCreate(id: string) {
		navigate(PathProvider.serie.base(id));
	}

	async function AfterEdit() {
		setEditId(undefined);
		setOpen(false);
		await refresh();
	}

	const filteredSeries = useMemo(() => {
		return series.filter((x) => {
			return x.year === year;
		});
	}, [year, series]);

	return (
		<>
			<span className="m-[12px] flex gap-1.5">
				<Dialog
					open={open}
					onOpenChange={setOpen}>
					<DialogTrigger>
						<Button color="primary">
							<PlusIcon />
							Dodaj
						</Button>
					</DialogTrigger>
					<DialogContent className="min-w-fit">
						<DialogHeader>
							<DialogTitle>{editId ? "Edytuj" : "Utwórz"} cykl</DialogTitle>
						</DialogHeader>
						<SeriesForm
							editCallback={AfterEdit}
							callback={AfterCreate}
							editId={editId}
						/>
					</DialogContent>
				</Dialog>
			</span>
			<div className=" grid grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-[15px]">
				{[...filteredSeries].map((series) => {
					return (
						<SeriesCard
							key={series.id}
							series={series}
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

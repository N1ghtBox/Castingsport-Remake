import type { GridRenderEditCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import GridAutocompleteInput from "@/components/GridAutocompleteInput";
import { getAllContestantNames } from "@/utils/jsonUtils";

export default function GridNameInput(props: GridRenderEditCellParams) {
	const [names, setNames] = useState<string[]>();

	useEffect(() => {
		let active = true;
		getAllContestantNames().then((result) => {
			if (active) setNames(result);
		});
		return () => {
			active = false;
		};
	}, []);

	return (
		<GridAutocompleteInput
			{...props}
			extraOptions={names}
		/>
	);
}

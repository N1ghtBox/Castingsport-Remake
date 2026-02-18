import { useMemo } from "react";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { useEditableTable } from "../base/use-editable-table";

export const useThlonResultTable = () => {
	const { results } = useThlonContext();

	const rows = useMemo(() => {
		return results;
	}, [results]);

	const tableApi = useEditableTable({
		rows,
	});

	return tableApi;
};

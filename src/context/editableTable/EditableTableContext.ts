import type { GridValidRowModel } from "@mui/x-data-grid";
import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { EditableTableContextApi } from "./EditableTableContext.types";

export const EditableTableContext = React.createContext<unknown>(null);

export const useEditableTableContext = <TModel extends GridValidRowModel>() => {
	return useGenericContext<EditableTableContextApi<TModel>["tableApi"]>(
		EditableTableContext,
	);
};

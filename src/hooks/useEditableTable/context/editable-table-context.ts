import type { GridValidRowModel } from "@mui/x-data-grid";
import React from "react";
import type { EditableTableApi } from "../base/use-editable-table.types";

export const EditableTableContext = React.createContext<unknown>(null);

export const useEditableTableContext = <TModel extends GridValidRowModel>() => {
    const context = React.useContext(EditableTableContext);

    if (context === null) {
        throw new Error(
            "useEditableTableContext must be used within a Editable table",
        );
    }

    return context as EditableTableApi<TModel>;
};

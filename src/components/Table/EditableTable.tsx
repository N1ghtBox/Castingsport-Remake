import {
    DataGrid,
    type GridEventListener,
    GridRowEditStopReasons,
    type GridRowModel,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import React from "react";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { Contestant } from "@/types/Contestant";
import type { EditableTableComponentProps } from "./EditableTable.types";

export default function EditableTable(props: EditableTableComponentProps) {
    const competition = React.useContext(CompetitonContext);

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event,
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel<Contestant>) => {
        const updatedRow = { ...newRow, isNew: false };

        competition.updateContestants((prevRows) =>
            prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
        );
        window.localStorage.setItem("lastCategoryAdded", updatedRow.category);
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        props.setRowModesModel(newRowModesModel);
    };

    return (
        <DataGrid
            rows={competition.contestants
                .filter((x) =>
                    x[props.searchProperty ?? "name"].includes(props.searchValue ?? ""),
                )
                .map((x) => {
                    return { ...x, isNew: false };
                })}
            style={{ border: "none" }}
            columns={props.columns}
            editMode="row"
            autoPageSize
            rowModesModel={props.rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: props.toolbar }}
            hideFooterSelectedRowCount
            localeText={{
                MuiTablePagination: {
                    labelDisplayedRows: (args) =>
                        `${args.from} - ${args.to} z ${args.count}`,
                },
            }}
            slotProps={{
                toolbar: props.toolbar ? props.toolbarProps : undefined,
            }}
        />
    );
}

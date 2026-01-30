import {
    DataGrid,
    type GridEventListener,
    GridRowEditStopReasons,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { CompetitonContext } from "@/types/CompetitionContext";
import { ContestContext } from "@/types/ContestContext";
import type { EditableTableComponentProps } from "./EditableTable.types";

export default function EditableTable(props: EditableTableComponentProps) {
    const competition = React.useContext(CompetitonContext);
    const contest = React.useContext(ContestContext);
    const context = props.context;

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event,
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut
            || params.reason === GridRowEditStopReasons.escapeKeyDown
        ) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        props.setRowModesModel(newRowModesModel);
    };

    const rows = useMemo(() => {
        if (context === "Competition") return competition.contestants;
        return contest.currentContestants;
    }, [context, competition, contest]);

    return (
        <DataGrid
            rows={rows
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
            processRowUpdate={props.processRowUpdate}
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

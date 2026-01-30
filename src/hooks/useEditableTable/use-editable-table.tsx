import {
    type GridRowId,
    type GridRowModel,
    GridRowModes,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import type { EditableTableComponentProps } from "@/components/Table/EditableTable.types";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { EditableContestant } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import type { EditableTableApi } from "./use-editable-table.types";

const useEditableTable = (
    context: EditableTableComponentProps["context"],
): EditableTableApi => {
    const competition = React.useContext(CompetitonContext);
    const contest = React.useContext(ContestContext);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {},
    );

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        competition.updateContestants((contestants) =>
            contestants.filter((row) => row.id !== id),
        );
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const enterEditMode = () => {
        setRowModesModel(
            rows.reduce((acc, row) => {
                acc[row.id] = { mode: GridRowModes.Edit };
                return acc;
            }, {} as GridRowModesModel),
        );
    };

    const pendingRows = React.useMemo(() => {
        return Object.entries(rowModesModel)
            .filter(([_, value]) => value.mode === GridRowModes.Edit)
            .map(([key]) => key);
    }, [rowModesModel]);

    const rows = useMemo(() => {
        if (context === "Competition") return competition.contestants;
        return contest.currentContestants;
    }, [context, competition.contestants, contest.currentContestants]);

    const processRowUpdate = (newRow: GridRowModel<EditableContestant>) => {
        const updatedRow = { ...newRow, isNew: false };

        competition.updateContestants((prevRows) =>
            prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
        );
        window.localStorage.setItem("lastCategoryAdded", updatedRow.category);
        return updatedRow;
    };

    return {
        Props: {
            processRowUpdate,
            context,
            rowModesModel,
            setRowModesModel,
        },
        Params: {
            pendingRows,
            rows: rows as EditableContestant[],
        },
        Actions: {
            handleCancelClick,
            handleSaveClick,
            handleEditClick,
            handleDeleteClick,
            enterEditMode,
        },
    };
};

export default useEditableTable;

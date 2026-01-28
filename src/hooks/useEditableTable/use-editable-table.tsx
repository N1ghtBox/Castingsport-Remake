import {
    type GridRowId,
    GridRowModes,
    type GridRowModesModel,
} from "@mui/x-data-grid";
import React from "react";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { EditableTableHookReturn } from "./use-editable-table.types";

const useEditableTable = (): EditableTableHookReturn => {
    const competition = React.useContext(CompetitonContext);
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

    const pendingRows = React.useMemo(() => {
        return Object.entries(rowModesModel)
            .filter(([_, value]) => value.mode === GridRowModes.Edit)
            .map(([key]) => key);
    }, [rowModesModel]);

    return [
        {
            rowModesModel,
            setRowModesModel,
        },
        {
            Params: {
                pendingRows,
            },
            Actions: {
                handleCancelClick,
                handleSaveClick,
                handleEditClick,
                handleDeleteClick,
            },
        },
    ];
};

export default useEditableTable;

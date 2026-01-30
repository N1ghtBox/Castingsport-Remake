import type { GridPreProcessEditCellProps } from "@mui/x-data-grid";
import type { EditableContestant } from "@/types/Contestant";

export const getContestScoreValidator =
    () => (params: GridPreProcessEditCellProps<number, EditableContestant>) => {
        if (params.props.value === undefined)
            return { ...params.props, error: "Wymagana wartość" };

        if (params.props.value < 0)
            return { ...params.props, error: "Wartość musi być w większa o 0" };

        return { ...params.props, error: false };
    };

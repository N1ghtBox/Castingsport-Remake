import type { EditableContestant } from "@/types/Contestant";
import type {
    GridColDef,
    GridRowModesModel,
    GridToolbarProps,
    ToolbarPropsOverrides,
} from "@mui/x-data-grid";

export type OptionalToolbar =
    | {
        toolbar?: undefined;
    }
    | {
        toolbar: React.JSXElementConstructor<
            GridToolbarProps & ToolbarPropsOverrides
        >;
        toolbarProps: GridToolbarProps & ToolbarPropsOverrides;
    };

export type EditableTableComponentProps = {
    searchValue?: string;
    searchProperty?: "id" | "name" | "club";
    rowModesModel: GridRowModesModel;
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
    readonly columns: GridColDef<EditableContestant>[];
} & OptionalToolbar;

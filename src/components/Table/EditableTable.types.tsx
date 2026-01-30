import type {
    GridColDef,
    GridRowModel,
    GridRowModesModel,
    GridToolbarProps,
    ToolbarPropsOverrides,
} from "@mui/x-data-grid";
import type { EditableContestant } from "@/types/Contestant";

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
    processRowUpdate: (newRow: GridRowModel<EditableContestant>) => EditableContestant
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
    readonly columns: GridColDef<EditableContestant>[];
    context: keyof typeof EditableTableContext;
} & OptionalToolbar;

export const EditableTableContext = {
    Competition: "Competition",
    Contest: "Contest"
} as const

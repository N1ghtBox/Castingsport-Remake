import {
    DataGrid,
    type GridEventListener,
    GridRowEditStopReasons,
    type GridRowModesModel,
    type GridValidRowModel,
} from "@mui/x-data-grid";
import { EditableTableContext } from "./../../hooks/useEditableTable/index";
import type { EditableTableComponentProps } from "./EditableTable.types";

export default function EditableTable<TModel extends GridValidRowModel>({
    Params,
    Props,
    Actions,
    columns,
    toolbar,
    ...tableProps
}: EditableTableComponentProps<TModel>) {
    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event,
    ) => {
        if (
            params.reason === GridRowEditStopReasons.rowFocusOut ||
            params.reason === GridRowEditStopReasons.escapeKeyDown
        ) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        Props.setRowModesModel(newRowModesModel);
    };

    return (
        <EditableTableContext.Provider
            value={{
                Params,
                Actions,
                Props,
            }}>
            <DataGrid
                {...tableProps}
                rows={Params.rows.map((x) => {
                    return { ...x, isNew: false };
                })}
                style={{ border: "none" }}
                columns={columns}
                editMode="row"
                autoPageSize
                rowModesModel={Props.rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={Props.processRowUpdate}
                slots={{ toolbar: toolbar }}
                hideFooterSelectedRowCount
                localeText={{
                    MuiTablePagination: {
                        labelDisplayedRows: (args) =>
                            `${args.from} - ${args.to} z ${args.count}`,
                    },
                }}
            />
        </EditableTableContext.Provider>
    );
}

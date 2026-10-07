import {
    DataGrid,
    type GridEventListener,
    type GridRowId,
    GridRowEditStopReasons,
    GridRowModes,
    type GridRowModesModel,
    type GridValidRowModel,
    gridExpandedSortedRowIdsSelector,
    gridPaginationModelSelector,
    gridVisibleColumnFieldsSelector,
    useGridApiRef,
} from "@mui/x-data-grid";
import { EditableTableContext } from "@/context/editableTable/EditableTableContext";
import type { EditableTableComponentProps } from "./EditableTable.types";

export default function EditableTable<TModel extends GridValidRowModel>({
    Params,
    Props,
    Actions,
    columns,
    toolbar,
    ...tableProps
}: EditableTableComponentProps<TModel>) {
    const apiRef = useGridApiRef();

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

    const getEditableFields = (id: GridRowId) =>
        gridVisibleColumnFieldsSelector(apiRef).filter((field) =>
            apiRef.current.isCellEditable(apiRef.current.getCellParams(id, field)),
        );

    // The grid only tabs between cells of a single row; continue into the next/previous row at the row edges.
    const handleCellKeyDown: GridEventListener<"cellKeyDown"> = (params, event) => {
        if (event.key !== "Tab" || params.cellMode !== GridRowModes.Edit) return;

        const fields = getEditableFields(params.id);
        const index = fields.indexOf(params.field);
        const forward = !event.shiftKey;
        if (index === -1 || index !== (forward ? fields.length - 1 : 0)) return;

        const rowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const targetIndex = rowIds.indexOf(params.id) + (forward ? 1 : -1);
        const targetId = rowIds[targetIndex];
        if (targetId === undefined) return;

        event.defaultMuiPrevented = true;
        event.preventDefault();

        const editRow = apiRef.current.state.editRows[params.id] ?? {};
        if (Object.values(editRow).some((cell) => cell.error)) return;

        const targetFields = getEditableFields(targetId);
        const targetField = forward ? targetFields[0] : targetFields[targetFields.length - 1];
        if (!targetField) return;

        const { page, pageSize } = gridPaginationModelSelector(apiRef);
        const targetPage = Math.floor(targetIndex / pageSize);
        if (targetPage !== page) apiRef.current.setPage(targetPage);

        if (apiRef.current.getRowMode(targetId) === GridRowModes.Edit) {
            apiRef.current.setCellFocus(targetId, targetField);
            return;
        }

        // Single-row editing: save the current row and start editing the target one.
        Props.setRowModesModel((prev) => ({
            ...prev,
            [params.id]: { mode: GridRowModes.View },
            [targetId]: { mode: GridRowModes.Edit, fieldToFocus: targetField },
        }));
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
                apiRef={apiRef}
                onCellKeyDown={handleCellKeyDown}
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
                isCellEditable={Params.lockReason ? () => false : undefined}
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

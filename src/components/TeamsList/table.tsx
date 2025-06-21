import { CompetitonContext } from '@/CompetitionLayout';
import type Team from '@/types/Teams';
import { TeamCategory } from '@/types/Teams';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
    type GridEventListener,
    GridRowEditStopReasons,
    type GridRowId,
    type GridRowModel,
    GridRowModes,
    type GridRowModesModel
} from '@mui/x-data-grid';
import * as React from 'react';
import TeamMemberInput from '../ui/TeamMemberInput';
import { EditToolbar } from './toolbar';

export default function TeamsTable() {
    const competition = React.useContext(CompetitonContext)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;

        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((prevModel) => ({ ...prevModel, [id]: { mode: GridRowModes.View } }));
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        competition.updateTeams(teams => teams.filter((row) => row.id !== id));
    };

    const processRowUpdate = (newRow: GridRowModel<Team>) => {
        const updatedRow = { ...newRow, isNew: false };

        competition.updateTeams((prevRows) => (prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<Team & { isNew: boolean }>[] = [
        { field: 'name', headerName: 'Nazwa', width: 180, editable: true, disableColumnMenu: true },
        {
            field: 'memberNames',
            headerName: 'Członkowie',
            type: 'custom',
            width: 300,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            renderCell: (row) => row.row.memberNames.join(', '),
            renderEditCell: (params) =>
                <TeamMemberInput
                    {...params}
                    contestants={competition.contestants}
                />
        },
        {
            field: 'category',
            headerName: 'Kategoria',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: Object.values(TeamCategory)
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Akcje',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={"saveAction"}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={"editAction"}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={"deleteAction"}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const pendingRows = React.useMemo(() => {
        return Object.entries(rowModesModel)
            .filter(([_, value]) => value.mode === GridRowModes.Edit)
            .map(([key]) => key)
    }, [rowModesModel])

    return (
        <DataGrid
            rows={competition.teams.map((x) => { return { ...x, isNew: false } })}
            style={{ border: 'none' }}
            columns={columns}
            editMode="row"
            autoPageSize
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: EditToolbar }}
            hideFooterSelectedRowCount
            localeText={{ "MuiTablePagination": { "labelDisplayedRows": (args) => `${args.from} - ${args.to} z ${args.count}` } }}
            slotProps={{
                toolbar: {
                    setTeams: competition.updateTeams,
                    setRowModesModel: setRowModesModel,
                    pendingRows: pendingRows,
                    saveChanges: handleSaveClick
                },
            }}
        />
    );
}
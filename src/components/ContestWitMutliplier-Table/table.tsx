import { CompetitonContext } from '@/CompetitionLayout';
import type { Contestant } from '@/types/Contestant';
import CancelIcon from '@mui/icons-material/Close';
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
import { useLoaderData } from 'react-router';
import { ErrorInput } from '../errorInput';
import { EditToolbar } from './toolbar';
import { ContestContext } from '../ContestScoreEditor';


export default function ContestWithMultiplierTable() {
    const competition = React.useContext(CompetitonContext)
    const contest = React.useContext(ContestContext)
    const [rows, setRows] = React.useState<Readonly<Array<Contestant & { isNew: boolean }>>>(contest.currentContestants.map((x) => { return { ...x, isNew: false } }));
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const contestId = Number.parseInt(useLoaderData());

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut
            || params.reason === GridRowEditStopReasons.escapeKeyDown
        ) {
            event.defaultMuiPrevented = true;
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
        competition.updateScores([...rows])
    }, [rows])

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((prevModel) => ({ ...prevModel, [id]: { mode: GridRowModes.View } }));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const processRowUpdate = (newRow: GridRowModel<Contestant>) => {
        const updatedRow = { ...newRow, isNew: false };

        setRows((prevRows) => (prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef<Contestant & { isNew: boolean }>[] = [
        {
            field: 'number',
            headerName: 'Nr. startowy',
            width: 50,
            disableColumnMenu: true,
        },
        { field: 'name', headerName: 'Imię i nazwisko', width: 180, disableColumnMenu: true },
        {
            field: 'club',
            headerName: 'Klub',
            type: 'string',
            width: 120,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'category',
            headerName: 'Kategoria',
            width: 150,
        },
        {
            field: 'score',
            headerName: 'Rzut',
            width: 150,
            editable: true,
            renderEditCell: (props) => <ErrorInput {...props} type='number' />,
            valueParser: (value) => Number.parseFloat(value) || 0,
            valueGetter: (_, row) => {
                return row.contests.find(x => x.id === contestId)?.score
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find(x => x.id === contestId);
                if (!contest) return row
                contest.score = value;
                contest.total = Math.round(value * 150) / 100;
                return row
            },
        },
        {
            field: 'total',
            headerName: 'Wynik',
            width: 150,
            valueGetter: (_, row) => {
                return row.contests.find(x => x.id === contestId)?.total
            },
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
                        />,
                        <GridActionsCellItem
                            key={"cancelAction"}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
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
            rows={rows}
            style={{ border: 'none' }}
            columns={columns}
            editMode="row"
            autoPageSize
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{ toolbar: (props) => EditToolbar(props) }}
            hideFooterSelectedRowCount
            localeText={{ "MuiTablePagination": { "labelDisplayedRows": (args) => `${args.from} - ${args.to} z ${args.count}` } }}
            slotProps={{
                toolbar: {
                    setRows,
                    setRowModesModel,
                    pendingRows: pendingRows,
                    saveChanges: handleSaveClick
                },
            }}
        />
    );
}
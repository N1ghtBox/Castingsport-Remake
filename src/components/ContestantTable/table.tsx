import { SetTakesPartInContests, TakesPartInContests } from '@/utils/contestUtils';
import { renderCheckIcon } from '@/utils/renderUtils';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
    type GridEventListener,
    type GridPreProcessEditCellProps,
    GridRowEditStopReasons,
    type GridRowId,
    type GridRowModel,
    GridRowModes,
    type GridRowModesModel,
    type GridValueSetter
} from '@mui/x-data-grid';
import * as React from 'react';
import { Categories, type Thlon, type Contestant } from '../../types/Contestant';
import { EditToolbar } from './toolbar';
import { ErrorInput } from '../errorInput';
import { CompetitonContext } from '@/CompetitionLayout';


const contestSetter = (key: keyof typeof Thlon): GridValueSetter<Contestant & { isNew: boolean }> => (value, row) => {
    //Workaround for 3-bój to be always set
    let updatedRow = SetTakesPartInContests(SetTakesPartInContests(row, value, key), true, "3boj")
    if (row.category !== Categories.Kadet)
        updatedRow = SetTakesPartInContests(row, true, "5boj")
    return updatedRow
}

export default function ContestantTable() {
    const competition = React.useContext(CompetitonContext)
    const [rows, setRows] = React.useState<Readonly<Array<Contestant & { isNew: boolean }>>>(competition.contestants.map((x) => { return { ...x, isNew: false } }));
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;

        }
    };

    React.useEffect(() => {
        competition.updateContestants([...rows])
    }, [rows, competition.updateContestants])

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel((prevModel) => ({ ...prevModel, [id]: { mode: GridRowModes.View } }));
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
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
            editable: true,
            disableColumnMenu: true,
            renderEditCell: ErrorInput,
            valueParser: (value) => Number.parseInt(value) || 0,
            preProcessEditCellProps: (params: GridPreProcessEditCellProps<number, Contestant & { isNew: boolean }>) => {
                if (!params.props.value || (Number.isNaN(params.props.value) || params.props.value < 0)) {
                    return { ...params.props, error: 'Nieprawidłowa wartość' };
                }

                if (rows.some(x => x.id !== params.row.id && x.number === params.props.value)) {
                    return { ...params.props, error: `Numer startowy ${params.props.value} już istnieje` };
                }
                return { ...params.props, error: false };
            },
        },
        { field: 'name', headerName: 'Imię i nazwisko', width: 180, editable: true, disableColumnMenu: true },
        {
            field: 'club',
            headerName: 'Klub',
            type: 'string',
            width: 120,
            align: 'left',
            headerAlign: 'left',
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Kategoria',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: Object.values(Categories)
        },
        {
            field: '3boj',
            headerName: '3-bój',
            width: 100,
            type: 'boolean',
            sortable: false,
            filterable: false,
            valueGetter: (_, row) => {
                return TakesPartInContests(row, "3boj")
            },
            valueSetter: contestSetter("3boj"),
            renderCell(params) {
                return renderCheckIcon(params.value)
            },
        },
        {
            field: '5boj',
            headerName: '5-bój',
            width: 100,
            editable: true,
            type: 'boolean',
            sortable: false,
            filterable: false,
            valueGetter: (_, row) => {
                return TakesPartInContests(row, "5boj")
            },
            valueSetter: contestSetter("5boj"),
            renderCell(params) {
                return renderCheckIcon(params.value)
            },
        },
        {
            field: 'multi',
            headerName: '2-bój multi',
            width: 100,
            editable: true,
            sortable: false,
            filterable: false,
            type: 'boolean',
            valueGetter: (_, row) => {
                return TakesPartInContests(row, "multi")
            },
            valueSetter: contestSetter("multi"),
            renderCell(params) {
                return renderCheckIcon(params.value)
            },
        },
        {
            field: 'distance',
            headerName: '2-bój odległościowy',
            width: 100,
            type: 'boolean',
            editable: true,
            sortable: false,
            filterable: false,
            hideable: false,
            valueGetter: (_, row) => {
                return TakesPartInContests(row, "distance")
            },
            valueSetter: contestSetter("distance"),
            renderCell(params) {
                return renderCheckIcon(params.value)
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
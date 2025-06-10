import { CompetitonContext } from '@/CompetitionLayout';
import {
    DataGrid,
    type GridColDef,
} from '@mui/x-data-grid';
import * as React from 'react';
import { ContestNames, type Contestant } from '../../types/Contestant';
import { EditToolbar } from './toolbar';
import { useLoaderData } from 'react-router';
import { RenderContestScore } from '@/utils/contestUtils';

export default function ThlonSummaryTable() {
    const { from, to } = useLoaderData() as { from: number, to: number };
    const competition = React.useContext(CompetitonContext)

    const columns: GridColDef<Contestant>[] = [
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
            disableColumnMenu: true,
            sortable: false,
            filterable: false,
        },
        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
            {
                field: `score${contestId + from}`,
                headerName: ContestNames.get(contestId),
                width: 120,
                disableColumnMenu: true,
                sortable: false,
                filterable: false,
                renderCell: (params) => {
                    return RenderContestScore(contestId, params.row);
                }
            } as GridColDef<Contestant>)),
        {
            field: 'total',
            headerName: 'Razem',
            width: 100,
            disableColumnMenu: true,
            sortable: false,
            filterable: false,
        }
    ];

    return (
        <DataGrid
            rows={competition.contestants}
            style={{ border: 'none' }}
            columns={columns}
            editMode="row"
            autoPageSize
            slots={{ toolbar: (props) => EditToolbar(props) }}
            hideFooterSelectedRowCount
            localeText={{ "MuiTablePagination": { "labelDisplayedRows": (args) => `${args.from} - ${args.to} z ${args.count}` } }}
        />
    );
}
import { TABLE_CONSTS } from '@/consts/TableConts';
import { ContestContext } from '@/types/ContestContext';
import {
    DataGrid,
    type GridColDef,
} from '@mui/x-data-grid';
import * as React from 'react';
import { useLoaderData } from 'react-router';
import { ContestNames, type Contestant } from '../../types/Contestant';
import { EditToolbar } from './toolbar';
import { RenderContestScore } from '@/utils/renderUtils';

export default function ThlonSummaryTable() {
    const { from, to } = useLoaderData() as { from: number, to: number };
    const contest = React.useContext(ContestContext)

    const columns: GridColDef<Contestant>[] = [
        {
            field: 'place',
            headerName: 'Miejsce',
            width: 90,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'number',
            headerName: 'Nr. startowy',
            width: 50,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        { field: 'name', headerName: 'Imię i nazwisko', width: 180, ...TABLE_CONSTS.REMOVE_MENU },
        {
            field: 'club',
            headerName: 'Klub',
            width: 120,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'category',
            headerName: 'Kategoria',
            ...TABLE_CONSTS.REMOVE_MENU
        },
        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map((contestId) => (
            {
                field: `score${contestId + from}`,
                headerName: ContestNames.get(contestId),
                width: 120,
                ...TABLE_CONSTS.REMOVE_MENU,
                renderCell: (params) =>
                    <span>{RenderContestScore(contestId, params.row)}</span>
            } as GridColDef<Contestant>)),
        {
            field: 'total',
            headerName: 'Razem',
            width: 100,
            renderCell: (params) => <span>{params.value.toFixed(2)}</span>,
            ...TABLE_CONSTS.REMOVE_MENU
        }
    ];


    return (

        <DataGrid
            rows={contest.currentContestants}
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
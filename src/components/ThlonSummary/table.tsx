import { CompetitonContext } from '@/CompetitionLayout';
import {
    DataGrid,
    type GridColDef,
} from '@mui/x-data-grid';
import * as React from 'react';
import { type CategoryValues, ContestNames, type Contestant } from '../../types/Contestant';
import { EditToolbar } from './toolbar';
import { useLoaderData } from 'react-router';
import { GetThlonResult, RenderContestScore, TakesPartInContests } from '@/utils/contestUtils';
import { TABLE_CONSTS } from '@/consts/TableConts';
import { ContestContext } from '@/types/ContestContext';

export default function ThlonSummaryTable() {
    const { from, to } = useLoaderData() as { from: number, to: number };
    const [categoryFilter, setCategoryFilter] = React.useState<CategoryValues>("Kadet")
    const competition = React.useContext(CompetitonContext)

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
            ...TABLE_CONSTS.REMOVE_MENU
        }
    ];

    const results = React.useMemo(() =>
        competition.contestants
            .filter((contestant) => TakesPartInContests(contestant, from, to))
            .filter((contestant) => {
                if (!categoryFilter) return true;
                return contestant.category === categoryFilter;
            })
            .map((contestant) => ({
                ...contestant,
                total: GetThlonResult(contestant, from, to)
            }))
            .sort((a, b) => b.total - a.total)
            .map((contestant, index) => ({
                ...contestant,
                place: index + 1,
            }))
        , [competition.contestants, from, to, categoryFilter]);

    return (
        <ContestContext.Provider value={{
            currentContestants: results,
            setCategoryFilter: (category) => setCategoryFilter(category || "Unknown"),
            category: categoryFilter
        }}>
            <DataGrid
                rows={results}
                style={{ border: 'none' }}
                columns={columns}
                editMode="row"
                autoPageSize
                slots={{ toolbar: (props) => EditToolbar(props) }}
                hideFooterSelectedRowCount
                localeText={{ "MuiTablePagination": { "labelDisplayedRows": (args) => `${args.from} - ${args.to} z ${args.count}` } }}
            />
        </ContestContext.Provider>
    );
}
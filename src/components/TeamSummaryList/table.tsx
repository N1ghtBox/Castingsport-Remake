import { TABLE_CONSTS } from '@/consts/TableConts';
import type { Contestant } from '@/types/Contestant';
import type Team from '@/types/Teams';
import { TeamContext } from '@/types/TeamsContext';
import {
    DataGrid,
    type GridColDef,
} from '@mui/x-data-grid';
import * as React from 'react';
import { EditToolbar } from './toolbar';

type ContestantWithScore = {
    name: Contestant["name"]
    score: number
}

type TeamWithScore = {
    id: string,
    name: string,
    category: Team["category"]
    members: ContestantWithScore[]
    total: number
}

type TeamPlacements = TeamWithScore & { place: number }

export default function TeamSummaryTable() {
    const teamContext = React.useContext(TeamContext)

    const columns: GridColDef<TeamPlacements>[] = [
        {
            field: 'place',
            headerName: 'Miejsce',
            width: 90,
            renderCell: (params) => <div className='h-full flex items-center'>
                <span>{params.value}</span>
            </div>,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'name',
            headerName: 'Nazwa',
            width: 90,
            renderCell: (params) => <div className='h-full flex items-center'>
                <span>{params.value}</span>
            </div>,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'members',
            headerName: 'Zawodnicy',
            width: 300,
            renderCell: (params) => <div className='flex flex-col'>
                {params.row.members.sort((a, b) => b.score - a.score).map(member =>
                (<span key={member.name} className='flex justify-between'>
                    <span>{member.name}</span>
                    <span>{member.score} pkt</span>
                </span>)
                )}
            </div>,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'category',
            headerName: 'Kategoria',
            renderCell: (params) => <div className='h-full flex items-center'>
                <span>{params.value}</span>
            </div>,
            ...TABLE_CONSTS.REMOVE_MENU
        },
        {
            field: 'total',
            headerName: 'Razem',
            width: 100,
            renderCell: (params) => <div className='h-full flex items-center'>
                <span>{params.value.toFixed(2)}</span>
            </div>,
            ...TABLE_CONSTS.REMOVE_MENU
        }
    ];

    return (
        <DataGrid

            getRowHeight={() => 'auto'}
            rows={teamContext.teamResults}
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
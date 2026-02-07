import { Face, Face3 } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
    GridActionsCellItem,
    type GridColDef,
    type GridPreProcessEditCellProps,
    GridRowModes,
} from "@mui/x-data-grid";
import { ErrorInput } from "@/components/ErrorInput";

import GridTimeInput from "@/components/GridtimeInput";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import {
    Categories,
    type Contests,
    type EditableContestant,
    Thlon,
} from "@/types/Contestant";
import {
    contestSetter,
    getThlonName,
    TakesPartInThlon,
} from "@/utils/contestUtils";
import {
    chainValidators,
    greaterThan0Validator,
    lesserThan100Validator,
    multipleOfValidator,
} from "@/utils/inputUtils";
import { renderCheckIcon } from "@/utils/renderUtils";
import { TABLE_CONSTS } from "./TableConts";

const DisplayColumns = {
    NrStartowy: {
        field: "number",
        headerName: "Nr. startowy",
        width: 50,
        disableColumnMenu: true,
    },
    Miejsce: {
        field: "place",
        headerName: "Miejsce",
        width: 90,
        ...TABLE_CONSTS.REMOVE_MENU,
    },
    Imie: {
        field: "name",
        headerName: "Imię i nazwisko",
        width: 180,
        disableColumnMenu: true,
    },
    Klub: {
        field: "club",
        headerName: "Klub",
        type: "string",
        width: 120,
        align: "left",
        headerAlign: "left",
    },
    Kategoria: {
        field: "category",
        headerName: "Kategoria",
        width: 150,
    },
} satisfies Record<string, GridColDef<EditableContestant>>;

const EditColumns = {
    NrStartowy: {
        field: "number",
        headerName: "Nr. startowy",
        width: 50,
        disableColumnMenu: true,
        editable: true,
    },
    Imie: {
        field: "name",
        headerName: "Imię i nazwisko",
        width: 180,
        disableColumnMenu: true,
        editable: true,
    },
    Klub: {
        field: "club",
        headerName: "Klub",
        type: "string",
        width: 120,
        align: "left",
        headerAlign: "left",
        editable: true,
    },
} satisfies Record<string, GridColDef<EditableContestant>>;

const ActionColumns = {
    DoubleScore_Rzut1: ({ contestId }) => {
        return {
            field: "score",
            headerName: "Rzut 1",
            width: 150,
            editable: true,
            renderEditCell: (props) => (
                <ErrorInput
                    {...props}
                    type="number"
                />
            ),
            valueParser: (value) => Number.parseFloat(value) || 0,
            valueGetter: (_, row) => {
                return row.contests.find((x) => x.id === contestId)?.score || undefined;
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return row;
                contest.score = value || 0;
                contest.total = contest.score + (contest.second_score || 0);
                return row;
            },
            preProcessEditCellProps: greaterThan0Validator,
        };
    },
    DoubleScore_Rzut2: ({ contestId }) => {
        return {
            field: "score2",
            headerName: "Rzut 2",
            width: 150,
            editable: true,
            renderEditCell: (props) => (
                <ErrorInput
                    {...props}
                    type="number"
                />
            ),
            valueParser: (value) => Number.parseFloat(value) || 0,
            valueGetter: (_, row) => {
                return (
                    row.contests.find((x) => x.id === contestId)?.second_score ||
                    undefined
                );
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return row;
                contest.second_score = value || 0;
                contest.total = contest.score + (contest.second_score || 0);
                return row;
            },
            preProcessEditCellProps: greaterThan0Validator,
        };
    },
    SingleScore_Time: ({ contestId }) => {
        return {
            field: "time",
            headerName: "Czas",
            width: 150,
            editable: true,
            renderEditCell: GridTimeInput,
            valueGetter: (_, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return "";
                const time = contest.time;
                if (!time) return "";
                return time;
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return row;
                contest.time = value;
                return row;
            },
        };
    },
    SingleScore_Score: ({ multipleOf, contestId }) => {
        return {
            field: "score",
            headerName: "Wynik",
            width: 150,
            editable: true,
            renderEditCell: ErrorInput,
            valueParser: (value) => Number.parseInt(value) || 0,
            valueGetter: (_, row) => {
                return row.contests.find((x) => x.id === contestId)?.score;
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return row;
                contest.score = value;
                contest.total = value;
                return row;
            },
            preProcessEditCellProps: chainValidators(
                greaterThan0Validator,
                lesserThan100Validator,
                multipleOfValidator(multipleOf || 1),
            ),
        };
    },
    ScoreWithMultiplier_Score: ({ contestId }) => {
        return {
            field: "score",
            headerName: "Rzut",
            width: 150,
            editable: true,
            renderEditCell: (props) => (
                <ErrorInput
                    {...props}
                    type="number"
                />
            ),
            valueParser: (value) => Number.parseFloat(value) || 0,
            valueGetter: (_, row) => {
                return row.contests.find((x) => x.id === contestId)?.score;
            },
            valueSetter: (value, row) => {
                const contest = row.contests.find((x) => x.id === contestId);
                if (!contest) return row;
                contest.score = value;
                contest.total = Math.round(value * 150) / 100;
                return row;
            },
        };
    },
    ScoreWithMultiplier_MultipliedScore: ({ contestId }) => {
        return {
            field: "total",
            headerName: "Wynik",
            width: 150,
            valueGetter: (_, row) => {
                return row.contests.find((x) => x.id === contestId)?.total;
            },
        };
    },
    Kategoria: ({ tableApi }) => {
        return {
            field: "category",
            headerName: "Kategoria",
            width: 150,
            editable: true,
            type: "singleSelect",
            valueSetter: (val, row) => {
                if (val !== row.category) {
                    row.category = val;
                    tableApi.Props.processRowUpdate(row);
                }

                return row;
            },
            valueOptions: Object.values(Categories).filter(
                (x) => x !== Categories.Unknown,
            ),
        };
    },
    TakesPartIn: ({ thlon }) => {
        return {
            field: thlon || "3boj",
            headerName: getThlonName(
                Thlon[thlon || "3boj"].from,
                Thlon[thlon || "3boj"].to,
            ),
            width: 100,
            type: "boolean",
            editable: thlon !== "3boj",
            disableColumnMenu: true,
            sortable: false,
            valueGetter: (_, row) => {
                return TakesPartInThlon(row, thlon || "3boj");
            },
            valueSetter: contestSetter(thlon || "3boj"),
            renderCell(params) {
                return renderCheckIcon(params.value);
            },
        };
    },
    NrStartowy: ({ tableApi }) => {
        return {
            field: "number",
            headerName: "Nr. startowy",
            width: 50,
            editable: true,
            disableColumnMenu: true,
            renderEditCell: ErrorInput,
            valueParser: (value) => Number.parseInt(value) || 0,
            preProcessEditCellProps: (
                params: GridPreProcessEditCellProps<number, EditableContestant>,
            ) => {
                if (
                    !params.props.value ||
                    Number.isNaN(params.props.value) ||
                    params.props.value < 0
                ) {
                    return { ...params.props, error: "Nieprawidłowa wartość" };
                }

                if (
                    tableApi.Params.rows.some(
                        (x) => x.id !== params.row.id && x.number === params.props.value,
                    )
                ) {
                    return {
                        ...params.props,
                        error: `Numer startowy ${params.props.value} już istnieje`,
                    };
                }
                return { ...params.props, error: false };
            },
        };
    },
    Akcje: ({ tableApi, actions }) => {
        return {
            field: "actions",
            type: "actions",
            headerName: "Akcje",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id, row }) => {
                const isInEditMode =
                    tableApi.Props.rowModesModel[id]?.mode === GridRowModes.Edit;

                const action = [];

                if (isInEditMode) {
                    if (actions?.Edit)
                        action.push(
                            <GridActionsCellItem
                                key={"saveAction"}
                                icon={<SaveIcon />}
                                label="Save"
                                sx={{
                                    color: "primary.main",
                                }}
                                onClick={() => tableApi.Actions.handleSaveClick(id)}
                            />,
                            <GridActionsCellItem
                                key={"cancelAction"}
                                icon={<CancelIcon />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={() => tableApi.Actions.handleCancelClick(id)}
                                color="inherit"
                            />,
                        );

                    if (row.category === Categories.Kadet && actions?.KadetToogle) {
                        action.unshift(
                            <GridActionsCellItem
                                key={"girlAction"}
                                icon={row.girl ? <Face3 /> : <Face />}
                                label="Kadetka"
                                className="textPrimary"
                                onClick={() =>
                                    tableApi.Props.processRowUpdate({ ...row, girl: !row.girl })
                                }
                                color="inherit"
                            />,
                        );
                    }

                    return action;
                }

                if (actions?.Edit)
                    action.push(
                        <GridActionsCellItem
                            key={"editAction"}
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={() => tableApi.Actions.handleEditClick(id)}
                            color="inherit"
                        />,
                    );

                if (actions?.Delete)
                    action.push(
                        <GridActionsCellItem
                            key={"deleteAction"}
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={() => tableApi.Actions.handleDeleteClick(id)}
                            color="inherit"
                        />,
                    );

                return action;
            },
        };
    },
} satisfies Record<
    string,
    (props: ColumnFactoryParams) => GridColDef<EditableContestant>
>;

type ColumnFactoryParams = {
    editable?: boolean;
    tableApi: EditableTableApi<EditableContestant>;
    actions?: ActionSet;
    thlon?: keyof typeof Thlon;
    contestId?: Contests;
    multipleOf?: number;
};

type ActionKey = keyof typeof ActionColumnOptions;

type ActionSet = Partial<Record<ActionKey, true>>;

export const ActionColumnOptions = {
    Delete: "delete",
    KadetToogle: "kadetToogle",
    Edit: "edit",
};

type TableColumns = {
    readonly Display: typeof DisplayColumns;
    readonly Actions: typeof ActionColumns;
    readonly Edit: typeof EditColumns;
};

const Columns: TableColumns = {
    Display: DisplayColumns,
    Actions: ActionColumns,
    Edit: EditColumns,
} as const;

export default Columns;

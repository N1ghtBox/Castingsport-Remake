import type { GridColDef } from "@mui/x-data-grid";
import type { TFunction } from "i18next";
import TeamMemberInput from "@/components/ui/TeamMemberInput";
import type { TableColumns } from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import { type EditableTeam, TeamCategory } from "@/types/Teams";

export const getColumn = (
    tableApi: EditableTableApi<EditableTeam>,
    Cols: TableColumns,
    t: TFunction,
): GridColDef<EditableTeam>[] => {
    return [
        {
            field: "name",
            headerName: t("table.name"),
            width: 270,
            editable: true,
            disableColumnMenu: true,
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value}</span>
                </div>
            ),
        },
        {
            field: "memberNames",
            headerName: t("table.members"),
            type: "custom",
            width: 380,
            align: "left",
            headerAlign: "left",
            editable: true,
            renderCell: (params) => {
                const names = params.row.memberNames.join(", ");
                return (
                    <span
                        key={params.row.id}
                        className="block min-w-0 truncate"
                        title={names}>
                        {names}
                    </span>
                );
            },
            renderEditCell: (params) => <TeamMemberInput {...params} />,
        },
        {
            field: "category",
            headerName: t("table.category"),
            width: 150,
            editable: true,
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value}</span>
                </div>
            ),
            type: "singleSelect",
            valueOptions: Object.values(TeamCategory),
        },
        {
            field: "members",
            headerName: "Member",
            width: 0,
            editable: true,
        },
        Cols.Actions.Akcje({
            tableApi,
            actions: {
                Delete: true,
                Edit: true,
            },
        }),
    ];
};

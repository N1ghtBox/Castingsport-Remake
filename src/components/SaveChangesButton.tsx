import type { GridRowId } from "@mui/x-data-grid";
import { SaveIcon } from "lucide-react";
import type { RowAction } from "@/hooks/useEditableTable/base/use-editable-table.types";
import { Button } from "./ui/button";

type SaveChangesButtonProps = {
    pendingRows: GridRowId[];
    saveChanges: RowAction;
};

export default function SaveChangesButton(props: SaveChangesButtonProps) {
    const saveAllPendingChanges = () => {
        for (let i = 0; i < props.pendingRows.length; i++) {
            const element = props.pendingRows[i];
            props.saveChanges(element);
        }
    };

    return (
        <Button
            color="primary"
            disabled={props.pendingRows.length === 0}
            onClick={saveAllPendingChanges}>
            <SaveIcon />
            Zapisz zmiany
        </Button>
    );
}

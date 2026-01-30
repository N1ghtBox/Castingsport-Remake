import { EditIcon } from "lucide-react";
import { Button } from "./ui/button";

type EditModeButtonProps = {
    enterEditMode?: () => void;

}

export default function EditModeButton({ enterEditMode }: EditModeButtonProps) {
    if (!enterEditMode) return

    return (<Button
        color="primary"
        onClick={enterEditMode}>
        <EditIcon />
        Tryb edycji
    </Button>)
}
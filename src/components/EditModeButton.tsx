import { EditIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

type EditModeButtonProps = {
    enterEditMode?: () => void;
}

export default function EditModeButton({ enterEditMode }: EditModeButtonProps) {
    const { t } = useTranslation();

    if (!enterEditMode) return

    return (<Button
        color="primary"
        onClick={enterEditMode}>
        <EditIcon />
        {t("common.editMode")}
    </Button>)
}

import { EditIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LockTooltip } from "./LockTooltip";
import { Button } from "./ui/button";

type EditModeButtonProps = {
    enterEditMode?: () => void;
    lockReason?: string;
}

export default function EditModeButton({ enterEditMode, lockReason }: EditModeButtonProps) {
    const { t } = useTranslation();

    if (!enterEditMode) return

    return (
        <LockTooltip reason={lockReason}>
            <Button
                color="primary"
                disabled={!!lockReason}
                onClick={enterEditMode}>
                <EditIcon />
                {t("common.editMode")}
            </Button>
        </LockTooltip>
    )
}

import { Print } from "@mui/icons-material";
import type { UsePDFInstance } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import usePDFActions from "@/hooks/use-pdf-actions";
import PrintBackButton from "./PrintBackButton";
import { Button } from "./ui/button";
import CategoryCombobox from "./ui/CategoryCombobox";
import TeamCategoryCombobox from "./ui/TeamCategoryCombobox";
import ThlonCategoryCombobox from "./ui/ThlonCategoryCombobox";


type PrintActionButtonsProps = {
    instance: UsePDFInstance;
    printName: string;
    additionalActions?: JSX.Element,
    teams?: boolean
    thlons?: boolean
    invalid?: boolean
    hasCategoryCombobox?: boolean
};

export default function PrintActionButtons({
    instance,
    printName,
    additionalActions,
    teams,
    thlons,
    hasCategoryCombobox,
    invalid
}: PrintActionButtonsProps) {
    const { printPDF, downloadPDF } = usePDFActions();
    const { t } = useTranslation();

    return (
        <div className="w-full flex gap-5 items-center px-4 h-[8vh]">
            <PrintBackButton />
            {hasCategoryCombobox &&
                <>
                    {teams ?
                        <TeamCategoryCombobox placeholder={t("common.allCategories")} /> :
                        thlons ?
                            <ThlonCategoryCombobox placeholder={t("common.allCategories")} allowDeselect={true} /> :
                            <CategoryCombobox placeholder={t("common.allCategories")} />
                    }
                </>
            }
            <Button
                disabled={instance.loading || invalid}
                onClick={async () => await downloadPDF(instance.blob, printName)}>
                <Download /> {instance.loading ? t("common.loading") : t("common.download")}
            </Button>
            <Button
                disabled={instance.loading || invalid}
                onClick={async () => await printPDF(instance.blob)}>
                <Print /> {t("common.print")}
            </Button>
            {additionalActions}
        </div>
    );
}

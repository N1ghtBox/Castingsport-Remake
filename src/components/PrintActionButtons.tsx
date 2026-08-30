import { Print } from "@mui/icons-material";
import type { UsePDFInstance } from "@react-pdf/renderer";
import { Download, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import usePDFActions from "@/hooks/use-pdf-actions";
import { usePdfLang } from "@/i18n/pdfLang";
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
    const [pdfLang, setPdfLang] = usePdfLang();

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
            <Button
                variant="outline"
                title={t("print.pdfLanguage")}
                onClick={() => setPdfLang(pdfLang === "pl" ? "en" : "pl")}>
                <Languages /> {pdfLang.toUpperCase()}
            </Button>
            {additionalActions}
        </div>
    );
}

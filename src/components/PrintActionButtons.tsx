import { Print } from "@mui/icons-material";
import type { UsePDFInstance } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import usePDFActions from "@/hooks/use-pdf-actions";
import PrintBackButton from "./PrintBackButton";
import { Button } from "./ui/button";
import CategoryCombobox from "./ui/CategoryCombobox";

type PrintActionButtonsProps = {
    instance: UsePDFInstance;
    printName: string;
    additionalActions?: JSX.Element
};

export default function PrintActionButtons({
    instance,
    printName,
    additionalActions
}: PrintActionButtonsProps) {
    const { printPDF, downloadPDF } = usePDFActions();

    return (
        <div className="w-full flex gap-5 items-center px-4 h-[8vh]">
            <PrintBackButton />
            <CategoryCombobox />
            <Button
                disabled={instance.loading}
                onClick={async () => await downloadPDF(instance.blob, printName)}>
                <Download /> {instance.loading ? "Ładowanie..." : "Pobierz"}
            </Button>
            <Button
                disabled={instance.loading}
                onClick={async () => await printPDF(instance.blob)}>
                <Print /> Drukuj
            </Button>
            {additionalActions}
        </div>
    );
}

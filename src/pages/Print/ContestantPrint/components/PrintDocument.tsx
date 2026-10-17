import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { Competition } from "@/types/Competition";
import type { Contestant } from "@/types/Contestant";
import ResultTable from "./ResultTable";

type PrintDocumentProps = {
    comp: Omit<Competition, "id">;
    contestants: Contestant[];
    showCreatorFooter?: boolean;
    mainJudgeLabel: string;
    secretaryLabel: string;
    providedByLabel: string;
};

export default function PrintDocument({
    comp,
    contestants,
    showCreatorFooter,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
}: PrintDocumentProps) {
    return (
        <Document
            title={PdfConsts.title}
            creator={PdfConsts.creator}>
            <Page
                size="A4"
                style={PdfConsts.styles.page}>
                <PrintHeader comp={comp as Competition} />
                <ResultTable data={contestants} />
                <PrintFooter
                    comp={comp}
                    showCreatorFooter={showCreatorFooter}
                    mainJudgeLabel={mainJudgeLabel}
                    secretaryLabel={secretaryLabel}
                    providedByLabel={providedByLabel}
                />
            </Page>
        </Document>
    );
}

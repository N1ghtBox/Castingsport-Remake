import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { Competition, Subcategory } from "@/types/Competition";
import type { ContestantWithThlonResult } from "../ThlonResults";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type PrintDocumentProps = {
    comp: Omit<Competition, "id"> | null;
    category: string;
    from: number;
    to: number;
    results: ContestantWithThlonResult[];
    showCreatorFooter?: boolean;
    mainJudgeLabel: string;
    secretaryLabel: string;
    providedByLabel: string;
    thlonName: string;
    contestsLabel: string;
    subcategory?: Subcategory;
};

export default function PrintDocument({
    comp,
    category,
    from,
    to,
    results,
    showCreatorFooter,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
    thlonName,
    contestsLabel,
    subcategory,
}: PrintDocumentProps) {
    return (
        <Document
            title="Contest Results"
            creator="Castingsport Dawid Witczak">
            <Page
                size="A4"
                orientation={to - from + 1 >= 7 ? "landscape" : "portrait"}
                style={PdfConsts.styles.page}>
                <PrintHeader
                    comp={comp as Competition}
                    showQr
                    tab={`${to - (from - 1)}boj`}
                    category={category}
                    title={subcategory?.name}
                    subcategoryId={subcategory?.id}
                    horizontal={to - from + 1 >= 7}
                />
                <PrintTitle
                    category={category}
                    from={from}
                    to={to}
                    thlonName={thlonName}
                    contestsLabel={contestsLabel}
                />
                <ResultTable
                    data={results}
                    showNation={comp?.isInternational}
                    from={from}
                    to={to}
                />
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

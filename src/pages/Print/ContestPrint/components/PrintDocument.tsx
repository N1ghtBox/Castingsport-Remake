import { Document, Page } from "@react-pdf/renderer";
import ContestPrintInfo from "@/components/ContestPrintInfo";
import { FormData } from "@/components/FinalsButton/types/FinalsForm.types";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { Competition } from "@/types/Competition";
import { Contests } from "@/types/Contestant";
import type { ResultRow } from "../ContestResults";
import ResultTable from "./ResultTable";

type AdditionalProps =
    | {
        headers: string[];
        rowRenderer: (row: ResultRow) => JSX.Element;
    }
    | undefined;

type PrintDocumentProps = {
    comp: Competition | null;
    category: string;
    contestId: Contests;
    results: ResultRow[];
    additionalColumns: AdditionalProps;
    count: number | undefined;
    finalResults: FormData;
};

export default function PrintDocument({
    comp,
    category,
    contestId,
    results,
    additionalColumns,
    count,
    finalResults,
}: PrintDocumentProps) {

    return (
        <Document
            title="Contest Results"
            creator="Castingsport Dawid Witczak">
            <Page
                size="A4"
                style={PdfConsts.styles.page}>
                <PrintHeader
                    tab={`contest-${contestId}`}
                    category={category}
                    comp={comp!}
                    showQr />
                <ContestPrintInfo
                    category={category}
                    contestId={contestId}
                />
                <ResultTable
                    data={results}
                    additionalColumns={additionalColumns}
                    finals={{
                        finalCount: count,
                        finalResults,
                    }}
                />
                <PrintFooter comp={comp} />
            </Page>
        </Document>
    );
}

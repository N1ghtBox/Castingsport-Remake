import { Document, Page } from "@react-pdf/renderer";
import ContestPrintInfo from "@/components/ContestPrintInfo";
import PdfConsts from "@/consts/PdfConsts";
import type useFinalsButton from "@/hooks/use-finals-button";
import PrintFooter from "@/pages/PrintFooter";
import PrintHeader from "@/pages/PrintHeader";
import type Competition from "@/types/Competition";
import type { ResultRow } from "../ContestResults";
import ResultTable from "./ResultTable";

type AdditionalProps =
    | {
        headers: string[];
        rowRenderer: (row: ResultRow) => JSX.Element;
    }
    | undefined;

type PrintDocumentProps = {
    comp: Omit<Competition, "id"> | null;
    category: string;
    contestId: string;
    results: ResultRow[];
    additionalColumns: AdditionalProps;
    count: number | undefined;
    finalResults: ReturnType<typeof useFinalsButton>["finalResults"];
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
                <PrintHeader comp={comp} />
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

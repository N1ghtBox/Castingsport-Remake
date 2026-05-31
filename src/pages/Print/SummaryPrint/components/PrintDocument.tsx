import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { Competition } from "@/types/Competition";
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
};

export default function PrintDocument({
    comp,
    category,
    from,
    to,
    results,
    showCreatorFooter,
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
                    horizontal={to - from + 1 >= 7}
                />
                <PrintTitle
                    category={category}
                    from={from}
                    to={to}
                />
                <ResultTable
                    data={results}
                    from={from}
                    to={to}
                />
                <PrintFooter comp={comp} showCreatorFooter={showCreatorFooter} />
            </Page>
        </Document>
    );
}

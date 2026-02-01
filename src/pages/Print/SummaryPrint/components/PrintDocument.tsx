import { Document, Page } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import PrintFooter from "@/pages/PrintFooter";
import PrintHeader from "@/pages/PrintHeader";
import type Competition from "@/types/Competition";
import type { ContestantWithThlonResult } from "../ThlonResults";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type PrintDocumentProps = {
    comp: Omit<Competition, "id"> | null;
    category: string;
    from: number;
    to: number;
    results: ContestantWithThlonResult[];
};

export default function PrintDocument({
    comp,
    category,
    from,
    to,
    results,
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
                    comp={comp}
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
                <PrintFooter comp={comp} />
            </Page>
        </Document>
    );
}

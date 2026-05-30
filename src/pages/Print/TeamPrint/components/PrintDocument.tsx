import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { TeamContextProps } from "@/context/team/TeamContext.types";
import { Competition } from "@/types/Competition";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type PrintDocumentProps = {
    comp: Omit<Competition, "id">;
    category: TeamContextProps["category"];
    results: TeamContextProps["teamResults"];
};

export default function PrintDocument({
    comp,
    category,
    results,
}: PrintDocumentProps) {
    return (
        <Document
            title={PdfConsts.title}
            creator={PdfConsts.creator}>
            <Page
                size="A4"
                style={PdfConsts.styles.page}>
                <PrintHeader comp={comp as Competition} />
                <PrintTitle category={category} />
                <ResultTable data={results} />
                <PrintFooter comp={comp} />
            </Page>
        </Document>
    );
}

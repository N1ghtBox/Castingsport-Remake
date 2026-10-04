import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { TeamContextProps } from "@/context/team/TeamContext.types";
import { Competition, Subcategory } from "@/types/Competition";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type PrintDocumentProps = {
    comp: Omit<Competition, "id">;
    category: TeamContextProps["category"];
    results: TeamContextProps["teamResults"];
    showCreatorFooter?: boolean;
    mainJudgeLabel: string;
    secretaryLabel: string;
    providedByLabel: string;
    subcategory?: Subcategory;
};

export default function PrintDocument({
    comp,
    category,
    results,
    showCreatorFooter,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
    subcategory,
}: PrintDocumentProps) {
    return (
        <Document
            title={PdfConsts.title}
            creator={PdfConsts.creator}>
            <Page
                size="A4"
                style={PdfConsts.styles.page}>
                <PrintHeader comp={comp as Competition} title={subcategory?.name} />
                <PrintTitle category={category} />
                <ResultTable data={results} />
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

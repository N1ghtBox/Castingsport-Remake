import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { Competition } from "@/types/Competition";
import {
    Categories,
    type CategoryValues,
    Contests,
    ValidCategories,
    type Contestant,
} from "@/types/Contestant";
import { GenerateThlonResults } from "@/utils/convertUtils";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type Props = {
    comp: Competition | null;
    from: number;
    to: number;
    contestants: Contestant[];
    showCreatorFooter?: boolean;
};

function getValidCategoriesForThlon(from: number, to: number): CategoryValues[] {
    if (from < Contests.Arenberg && to <= Contests.Distance) {
        return ValidCategories.filter((c) => c !== Categories.Kadet);
    }
    if (from > Contests.Distance || to > Contests.Distance) {
        return [Categories.Man, Categories.Kobieta];
    }
    return ValidCategories;
}

export default function AllCategoriesDocument({ comp, from, to, contestants, showCreatorFooter }: Props) {
    const categories = getValidCategoriesForThlon(from, to);
    const isLandscape = to - from + 1 >= 7;

    return (
        <Document title="Contest Results" creator={PdfConsts.creator}>
            {categories.map((category) => {
                const results = GenerateThlonResults(contestants, category, { from, to });
                if (results.length === 0) return null;

                return (
                    <Page key={category} size="A4" orientation={isLandscape ? "landscape" : "portrait"} style={PdfConsts.styles.page}>
                        <PrintHeader
                            comp={comp as Competition}
                            showQr
                            tab={`${to - (from - 1)}boj`}
                            category={category}
                            horizontal={isLandscape}
                        />
                        <PrintTitle category={category} from={from} to={to} />
                        <ResultTable data={results} from={from} to={to} />
                        <PrintFooter comp={comp} showCreatorFooter={showCreatorFooter} />
                    </Page>
                );
            })}
        </Document>
    );
}

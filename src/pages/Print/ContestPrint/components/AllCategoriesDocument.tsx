import { Document, Page } from "@react-pdf/renderer";
import ContestPrintInfo from "@/components/ContestPrintInfo";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { Competition, Subcategory } from "@/types/Competition";
import {
    Categories,
    type CategoryValues,
    type Contestant,
    Contests,
    ValidCategories,
} from "@/types/Contestant";
import { ByContestantCategory, BySubcategory, ByTakesPart, chainFilters } from "@/utils/filterUtils";
import { TypeOfContest } from "@/utils/contestUtils";
import type { ResultRow } from "../ContestResults";
import { getAdditionalHeaders, getCompetitionScoreSorter } from "../utils";
import ResultTable from "./ResultTable";

type Props = {
    comp: Competition | null;
    contestId: Contests;
    contestants: Contestant[];
    showCreatorFooter?: boolean;
    contestName: string;
    contestLabel: string;
    mainJudgeLabel: string;
    secretaryLabel: string;
    providedByLabel: string;
    subcategory?: Subcategory;
};

function getValidCategoriesForContest(contestId: Contests): CategoryValues[] {
    if (
        contestId === Contests.MultiSkish ||
        contestId === Contests.MultiDistance ||
        contestId === Contests.FlyDistanceDoubleHand ||
        contestId === Contests.DistanceDoubleHand
    ) {
        return [Categories.Man, Categories.Kobieta];
    }
    if (contestId === Contests.FlySkish || contestId === Contests.FlyDistance) {
        return ValidCategories.filter((c) => c !== Categories.Kadet);
    }
    return ValidCategories;
}

export default function AllCategoriesDocument({
    comp,
    contestId,
    contestants,
    showCreatorFooter,
    contestName,
    contestLabel,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
    subcategory,
}: Props) {
    const categories = getValidCategoriesForContest(contestId);
    const contestType = TypeOfContest(contestId);
    const additionalColumns = getAdditionalHeaders(contestType);
    const sorter = getCompetitionScoreSorter(contestType);

    return (
        <Document title="Contest Results" creator={PdfConsts.creator}>
            {categories.map((category) => {
                const results: ResultRow[] = contestants
                    .filter(chainFilters(ByTakesPart(contestId), ByContestantCategory(category, contestId), BySubcategory(subcategory?.id)))
                    .map((x) => ({
                        category: x.category,
                        club: x.club,
                        nation: x.nation,
                        name: x.name,
                        number: x.number.toString(),
                        contestData: x.contests.find((r) => r.id === Number(contestId) && r.takesPart)!,
                    }))
                    .filter((x) => x.contestData)
                    .sort(sorter);

                if (results.length === 0) return null;

                return (
                    <Page key={category} size="A4" style={PdfConsts.styles.page}>
                        <PrintHeader tab={`contest-${contestId}`} category={category} comp={comp!} title={subcategory?.name} subcategoryId={subcategory?.id} showQr />
                        <ContestPrintInfo
                            category={category}
                            contestId={contestId}
                            contestName={contestName}
                            contestLabel={contestLabel}
                        />
                        <ResultTable
                            data={results}
                            showNation={comp?.isInternational}
                            additionalColumns={additionalColumns}
                            finals={{ finalCount: undefined, finalResults: undefined }}
                        />
                        <PrintFooter
                            comp={comp}
                            showCreatorFooter={showCreatorFooter}
                            mainJudgeLabel={mainJudgeLabel}
                            secretaryLabel={secretaryLabel}
                            providedByLabel={providedByLabel}
                        />
                    </Page>
                );
            })}
        </Document>
    );
}

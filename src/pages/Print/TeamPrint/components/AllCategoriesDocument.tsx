import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { Competition } from "@/types/Competition";
import type { Contestant } from "@/types/Contestant";
import { TeamCategory, type Team } from "@/types/Teams";
import { ByEmptyTeams, ByTeamCategory, chainFilters } from "@/utils/filterUtils";
import { sortByTotal } from "@/utils/sortUtils";
import { GetTeamResult } from "@/utils/teamUtils";
import { AddPlace } from "@/utils/convertUtils";
import PrintTitle from "./PrintTitle";
import ResultTable from "./ResultTable";

type Props = {
    comp: Competition | null;
    teams: Team[];
    contestants: Contestant[];
    showCreatorFooter?: boolean;
    mainJudgeLabel: string;
    secretaryLabel: string;
    providedByLabel: string;
};

export default function AllCategoriesTeamDocument({
    comp,
    teams,
    contestants,
    showCreatorFooter,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
}: Props) {
    return (
        <Document title={PdfConsts.title} creator={PdfConsts.creator}>
            {Object.values(TeamCategory).map((category) => {
                const results = teams
                    .filter(chainFilters(ByTeamCategory(category), ByEmptyTeams))
                    .map(GetTeamResult(contestants, category))
                    .sort(sortByTotal)
                    .map(AddPlace);

                if (results.length === 0) return null;

                return (
                    <Page key={category} size="A4" style={PdfConsts.styles.page}>
                        <PrintHeader comp={comp as Competition} />
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
                );
            })}
        </Document>
    );
}

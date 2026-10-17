import { Document, Page } from "@react-pdf/renderer";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import type { Competition, Subcategory } from "@/types/Competition";
import type { Contestant } from "@/types/Contestant";
import { type Team, TeamCategory } from "@/types/Teams";
import { GenerateTeamResults } from "@/utils/teamUtils";
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
    subcategory?: Subcategory;
};

export default function AllCategoriesTeamDocument({
    comp,
    teams,
    contestants,
    showCreatorFooter,
    mainJudgeLabel,
    secretaryLabel,
    providedByLabel,
    subcategory,
}: Props) {
    return (
        <Document
            title={PdfConsts.title}
            creator={PdfConsts.creator}>
            {Object.values(TeamCategory).map((category) => {
                const results = GenerateTeamResults(teams, contestants, category);

                if (results.length === 0) return null;

                return (
                    <Page
                        key={category}
                        size="A4"
                        style={PdfConsts.styles.page}>
                        <PrintHeader
                            tab="teams"
                            category={category}
                            comp={comp as Competition}
                            showQr
                        />
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

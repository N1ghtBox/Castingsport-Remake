import type { Competition } from "./Competition";
import type { Contestant } from "./Contestant";
import type { Series } from "./Series";
import type { Team } from "./Teams";

export type GeneralListsJson = {
    competitions: Array<Competition>;
    series: Array<Series>;
};

export type CompetitionJsonData = {
    name: string;
    contestants: Array<Contestant>;
    teams: Array<Team>;
};

// Competition details carried in an exported file. The logo path only exists on the exporting machine, so it's left out.
export type CompetitionMetadata = Omit<Competition, "id" | "lastSynced" | "logoUrl">;

export type CompetitionExportData = CompetitionJsonData & {
    // Missing in files exported before metadata was added.
    competition?: CompetitionMetadata;
};

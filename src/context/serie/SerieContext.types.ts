import type { CategoryValues } from "@/types/Contestant";
import type {
	SerieFinalContestantResults,
	SerieFinalTeamsResults,
	Series,
} from "@/types/Series";
import type { TeamCategoryValues } from "@/types/Teams";
import type { Action } from "@/utils/typeUtils";

export type SerieContextProps = {
	serie: Series;
	serieResults: SerieFinalContestantResults;
	category: CategoryValues;
	teamCategory: TeamCategoryValues;
	setCategory: Action<string>;
	setTeamCategory: Action<string>;
	teamResults: SerieFinalTeamsResults;
};

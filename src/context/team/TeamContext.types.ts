import type { FinalScoreTeam, Team } from "@/types/Teams";
import type { WithPlace, WithTotal } from "@/utils/typeUtils";

export type TeamContextProps = {
	teamResults: WithPlace<WithTotal<FinalScoreTeam>>[];
	category: Team["category"];
	setCategory: (newCategory: Team["category"]) => void;
};

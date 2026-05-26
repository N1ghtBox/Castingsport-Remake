import type {
	Competition,
	OrderConfig,
	PlatformConfig,
	TimeConfig,
} from "@/types/Competition";
import type { Contestant, EditableContestant } from "@/types/Contestant";
import type { EditableTeam, Team } from "@/types/Teams";
import type { Action } from "@/utils/typeUtils";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	teams: Array<Team>;
	compInfo: Competition;
	updateContestants: UpdateBaseSet<EditableContestant>;
	updateTeams: UpdateBaseSet<EditableTeam>;
	setTab: Action<number>;
	updateConfig: (config: UpdateConfigProps) => Promise<void>;
	syncToDb: () => void
};

type UpdateBaseSet<T> = React.Dispatch<React.SetStateAction<T[]>>;

type UpdateConfigProps = {
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
};

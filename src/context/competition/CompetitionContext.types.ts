import type Competition from "@/types/Competition";
import type { Contestant, EditableContestant } from "@/types/Contestant";
import type OrderConfig from "@/types/OrderConfig";
import type PlatformConfig from "@/types/PlatformConfig";
import type Team from "@/types/Teams";
import type { EditableTeam } from "@/types/Teams";
import type TimeConfig from "@/types/TimeConfig";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	teams: Array<Team>;
	loading: boolean;
	compInfo: Competition;
	updateContestants: UpdateBaseSet<EditableContestant>;
	updateTeams: UpdateBaseSet<EditableTeam>;
	setTab: (contestId: number) => void;
	updateConfig: (config: UpdateConfigProps) => Promise<void>;
};

type UpdateBaseSet<T> = React.Dispatch<React.SetStateAction<T[]>>;

type UpdateConfigProps = {
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
};

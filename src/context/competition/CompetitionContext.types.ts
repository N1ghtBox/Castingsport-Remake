import type {
	Competition,
	EventDurationConfig,
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
	syncToDb: (options?: SyncToDbOptions) => void
	/** Selected Subcategory id; undefined = all. Competition-wide, survives navigation. */
	subcategory: string | undefined;
	setSubcategory: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export type SyncToDbOptions = {
	ignoreStatus?: boolean;
	/** Marks the synced documents so the website keeps them off its main page. */
	debugOnly?: boolean;
};

type UpdateBaseSet<T> = React.Dispatch<React.SetStateAction<T[]>>;

type UpdateConfigProps = {
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
	eventDurationConfig?: EventDurationConfig;
	eventCooldown?: number;
};

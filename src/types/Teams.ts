import type { Prettify } from "node_modules/zod/dist/types/v4/core/util";
import type { Editable, ValueOf, WithTotal } from "@/utils/typeUtils";
import type { Contestant } from "./Contestant";

export type Team = {
	id: string;
	name: string;
	memberNames: Array<string>;
	members: Array<string>;
	category: TeamCategoryValues;
};

export type EditableTeam = Prettify<Editable<Team>>;

export type TeamMember = Prettify<WithTotal<Pick<Contestant, "name">>>;

export type FinalScoreTeam = Prettify<
	Omit<Team, "memberNames" | "members"> & {
		members: TeamMember[];
	}
>;

export const TeamCategory = {
	Junior: "Młodzieży",
	Senior: "Seniorów",
	Women: "Kobiet",
} as const;

export type TeamCategoryValues = ValueOf<typeof TeamCategory>;

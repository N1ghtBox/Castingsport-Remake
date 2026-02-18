import {
	type Contestant,
	Thlon,
} from "@/types/Contestant";
import type { FinalScoreTeam, Team, TeamCategoryValues } from "@/types/Teams";
import { GetThlonResult } from "./contestUtils";
import type { WithTotal } from "./typeUtils";

export const GetTeamResult =
	(contestants: Contestant[], category: TeamCategoryValues) =>
		(team: Team): WithTotal<FinalScoreTeam> => {
			const members = team.members.map((id) => {
				const contesant = contestants.find((x) => x.id === id);

				if (!contesant) {
					return {
						name: "",
						total: 0,
					};
				}

				const boj = category === "Młodzieży" ? "3boj" : "5boj";

				return {
					name: contesant.name,
					total: GetThlonResult(contesant, Thlon[boj].from, Thlon[boj].to),
				};
			});

			return {
				id: team.id,
				category: team.category,
				name: team.name,
				members: members,
				total: members.reduce((prev, curr) => prev + curr.total, 0),
			};
		};

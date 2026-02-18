import {
	Categories,
	type CategoryValues,
	type Contestant,
	Contests,
	type Thlon,
} from "@/types/Contestant";
import type { Team, TeamCategoryValues } from "@/types/Teams";
import {
	TakesPartInContest,
	TakesPartInContests,
	TypeOfContest,
} from "./contestUtils";

export const chainFilters =
	<T>(...filters: Array<(element: T) => boolean>) =>
		(element: T): boolean =>
			filters.every((filter) => filter(element));

export const ByTeamCategory =
	(category: TeamCategoryValues) => (team: Pick<Team, "category">) => {
		return team.category === category;
	};

export const ByDistanceContest = (contest: Contests) => {
	const type = TypeOfContest(contest);
	return type === "double" || type === "single";
};

export const ByPartOfTeam = (team: Team) => (contestant: Contestant) => {
	return team.members.includes(contestant.id);
};

export const ByEmptyTeams = (team: Team) => {
	return team.members.length > 0;
};

export const ByTakesPart = (contestId: number) => (contestant: Contestant) => {
	return TakesPartInContest(contestant, contestId);
};

export const ByTakesPartInThlon =
	(thlon: Thlon) => (contestant: Contestant) => {
		return TakesPartInContests(contestant, thlon.from, thlon.to);
	};

export const ByContestantCategory =
	(category: CategoryValues | undefined, contestId: number) =>
		(contestant: Contestant) => {
			if (!category) return true;
			let localContestantCategory = contestant.category;

			if (
				contestId === Contests.MultiSkish ||
				contestId === Contests.MultiDistance ||
				contestId === Contests.FlyDistanceDoubleHand ||
				contestId === Contests.DistanceDoubleHand ||
				contestId === Contests.FlySkish ||
				contestId === Contests.FlyDistance
			) {
				localContestantCategory =
					contestant.category === Categories.Kadet
						? contestant.girl
							? Categories.Juniorka
							: Categories.Junior
						: contestant.category;
			}

			if (
				contestId === Contests.MultiSkish ||
				contestId === Contests.MultiDistance ||
				contestId === Contests.FlyDistanceDoubleHand ||
				contestId === Contests.DistanceDoubleHand
			) {
				localContestantCategory =
					localContestantCategory === Categories.Junior ||
						localContestantCategory === Categories.Man
						? Categories.Man
						: Categories.Kobieta;
			}

			return localContestantCategory === category;
		};

export const ByContestantCategoryInThlon =
	(category: CategoryValues | undefined, thlon: Thlon) =>
		(contestant: Pick<Contestant, 'category' | 'girl'>) => {
			if (!category) return true;
			const { from, to } = thlon

			let localContestantCategory = contestant.category;
			if (Number(from) <= Contests.FlyDistance)
				localContestantCategory =
					contestant.category === Categories.Kadet && category !== Categories.Kadet
						? contestant.girl
							? Categories.Juniorka
							: Categories.Junior
						: contestant.category;

			if (
				Number(to) > Contests.Distance &&
				((localContestantCategory === Categories.Kadet && !contestant.girl) ||
					localContestantCategory === Categories.Junior ||
					localContestantCategory === Categories.Man)
			)
				localContestantCategory = Categories.Man;
			else if (
				Number(to) > Contests.Distance &&
				((localContestantCategory === Categories.Kadet && contestant.girl) ||
					localContestantCategory === Categories.Juniorka ||
					localContestantCategory === Categories.Kobieta)
			)
				localContestantCategory = Categories.Kobieta;

			return localContestantCategory === category;
		};
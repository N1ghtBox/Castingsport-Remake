import pLimit from "p-limit";
import { v4 as uuid } from "uuid";
import {
	Categories,
	type CategoryValues,
	type Contestant,
	Thlon,
} from "@/types/Contestant";
import type { Series } from "@/types/Series";
import type Team from "@/types/Teams";
import { TeamCategory } from "@/types/Teams";
import { GetThlonResult, TakesPartInContests } from "./contestUtils";
import {
	getCompData,
	getCompetitionInfo,
	getGeneralData,
	updateGeneralData,
} from "./jsonUtils";

const concurrency = 5;

type Thlons = keyof typeof Thlon;

const limit = pLimit(concurrency);

export const createSeries = async (
	series: Omit<Series, "id">,
): Promise<string> => {
	const id = uuid();

	const contents = await getGeneralData();

	contents.series.push({ ...series, id });

	await updateGeneralData(contents);

	return id;
};

export const getSerieData = async (
	id: Series["id"],
): Promise<Series | undefined> => {
	const { series } = await getGeneralData();

	return series.find((x) => x.id === id);
};

type CompTeam = Pick<Team, "category" | "id" | "name"> & {
	totalScore: number;
	place: number;
};

type SerieTeam = Pick<Team, "category" | "id" | "name"> & {
	placements: { compName: string; place: number; score: number }[];
};

type CompContestant = Pick<Contestant, "id" | "name" | "category" | "club"> & {
	totalScore: number;
	place: number;
};
type SerieContestant = Pick<Contestant, "id" | "name" | "category" | "club"> & {
	compPlacements: { compName: string; place: number; score: number }[];
};
export type SummedSerieContestant = Pick<
	Contestant,
	"id" | "name" | "category" | "club"
> & {
	compPlacements: { compName: string; place: number; score: number }[];
	totalScore: number;
	totalPlace: number;
};

export type SummedSerieTeam = Awaited<
	ReturnType<typeof calculateSerieTeamScores>
>[0];

export const calculateSerieTeamScores = async (serie: Series) => {
	let teamResults = await Promise.all(
		serie.competitionIds.map((id) => limit(() => getCompetitionTeamScores(id))),
	);

	teamResults = teamResults.sort((a, b) => a[0].localeCompare(b[0]));

	const SummedSerieTeams: SerieTeam[] = [];
	const SummedSerieTeamsCount: Record<
		(typeof TeamCategory)[keyof typeof TeamCategory],
		number[]
	> = {
		Młodzieży: [],
		Seniorów: [],
		Kobiet: [],
	};

	for (const [comp, teams] of teamResults) {
		SummedSerieTeamsCount.Młodzieży.push(
			teams.filter((x) => x.category === "Młodzieży").length,
		);
		SummedSerieTeamsCount.Seniorów.push(
			teams.filter((x) => x.category === "Seniorów").length,
		);
		SummedSerieTeamsCount.Kobiet.push(
			teams.filter((x) => x.category === "Kobiet").length,
		);
		for (const team of teams) {
			const existing = SummedSerieTeams.find(
				(x) =>
					x.category === team.category &&
					x.name.toLowerCase() === team.name.toLowerCase(),
			);
			if (!existing)
				SummedSerieTeams.push({
					...team,
					placements: [
						{ compName: comp, place: team.place, score: team.totalScore },
					],
				});
			else
				existing.placements.push({
					compName: comp,
					place: team.place,
					score: team.totalScore,
				});
		}
	}

	const teamsWithMissingCompetitions = SummedSerieTeams.filter(
		(x) => x.placements.length < serie.competitionIds.length,
	);

	for (const team of teamsWithMissingCompetitions) {
		const missingComps = teamResults
			.filter(
				([name]) => !team.placements.map((x) => x.compName).includes(name),
			)
			.map(([name]) => name);

		for (const missingComp of missingComps) {
			team.placements.push({
				compName: missingComp,
				place: Math.max(...SummedSerieTeamsCount[team.category]) + 1,
				score: 0,
			});
		}
	}

	return SummedSerieTeams.map((team) => ({
		id: team.id,
		category: team.category,
		name: team.name,
		placements: team.placements,
		totalPlace: team.placements.reduce((sum, item) => sum + item.place, 0),
		totalScore: team.placements.reduce((sum, item) => sum + item.score, 0),
	})).sort((a, b) => {
		if (a.totalPlace !== b.totalPlace) {
			return a.totalPlace - b.totalPlace;
		}
		return b.totalScore - a.totalScore;
	});
};

export const calculateSerieScores = async (serie: Series) => {
	let results = await Promise.all(
		serie.competitionIds.map((id) => limit(() => getCompetitionScores(id))),
	);

	results = results.sort((a, b) => a[0].localeCompare(b[0]));

	const SummedSerieContestants: Record<Thlons, SerieContestant[]> = {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	};

	const contestantsCountForCategory = Object.keys(Thlon).reduce(
		(prev, curr) => {
			prev[curr as Thlons] = {
				[Categories.Junior]: [],
				[Categories.Juniorka]: [],
				[Categories.Man]: [],
				[Categories.Kobieta]: [],
				[Categories.Unknown]: [],
				[Categories.Kadet]: [],
			};

			return prev;
		},
		{} as Record<Thlons, Record<CategoryValues, number[]>>,
	);

	CalculateContestantsResults(
		results,
		contestantsCountForCategory,
		SummedSerieContestants,
		serie,
	);

	return (
		Object.entries(SummedSerieContestants) as [Thlons, SerieContestant[]][]
	).reduce(
		(prev, [thlon, contenstants]) => {
			prev[thlon] = contenstants
				.map((con) => ({
					id: con.id,
					name: con.name,
					category: con.category,
					club: con.club,
					compPlacements: con.compPlacements,
					totalScore: con.compPlacements.reduce(
						(prev, curr) => prev + curr.score,
						0,
					),
					totalPlace: con.compPlacements.reduce(
						(prev, curr) => prev + curr.place,
						0,
					),
				}))
				.sort((a, b) => {
					if (a.totalPlace !== b.totalPlace) {
						return a.totalPlace - b.totalPlace;
					}
					return b.totalScore - a.totalScore;
				});

			return prev;
		},
		{} as Record<Thlons, Omit<SummedSerieContestant, "seriePlace">[]>,
	);
};

const getCompetitionScores = async (
	compId: string,
): Promise<[string, Record<Thlons, CompContestant[]>]> => {
	const comp = await getCompData(compId);
	if (!comp)
		return [
			"",
			{
				"3boj": [],
				"5boj": [],
				"7boj": [],
				"9boj": [],
				multi: [],
				distance: [],
			},
		];
	const { contestants } = comp;

	const serieContestants: Record<Thlons, CompContestant[]> = {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	};

	for (const [thlonKey, thlon] of Object.entries(Thlon) as [
		Thlons,
		typeof Thlon.multi,
	][]) {
		for (const categoryValue of Object.values(Categories) as CategoryValues[]) {
			const compContestants = contestants.filter((x) => {
				if (
					thlonKey === "distance" ||
					thlonKey === "multi" ||
					thlonKey === "9boj"
				) {
					if (x.category === "Junior") return categoryValue === Categories.Man;
					if (x.category === "Juniorka") return categoryValue === "Kobieta";
				}
				return x.category === categoryValue;
			});
			const categoryResults = compContestants
				.filter((con) => TakesPartInContests(con, thlon.from, thlon.to))
				.map((con) => {
					return {
						...con,
						totalScore: GetThlonResult(con, thlon.from, thlon.to),
					};
				})
				.sort((a, b) => b.totalScore - a.totalScore)
				.map(
					(con, i) =>
						({
							id: con.id,
							name: con.name,
							category: con.category,
							club: con.category,
							totalScore: con.totalScore,
							place: i + 1,
						}) as CompContestant,
				);

			serieContestants[thlonKey].push(...categoryResults);
		}
	}

	return [comp.name, serieContestants];
};

const getCompetitionTeamScores = async (
	compId: string,
): Promise<[string, CompTeam[]]> => {
	const comp = await getCompData(compId);
	if (!comp) return ["", []];
	const { teams, contestants } = comp;

	const serieTeam: CompTeam[] = [];

	for (const [_, categoryValue] of Object.entries(TeamCategory)) {
		serieTeam.push(
			...teams
				.filter((x) => x.category === categoryValue)
				.map((team) => {
					const teamContestants = contestants.filter((x) =>
						team.members.includes(x.id),
					);

					return {
						...team,
						totalScore: teamContestants.reduce((sum, item) => {
							if (categoryValue === "Młodzieży")
								sum += GetThlonResult(
									item,
									Thlon["3boj"].from,
									Thlon["3boj"].to,
								);
							else
								sum += GetThlonResult(
									item,
									Thlon["5boj"].from,
									Thlon["5boj"].to,
								);
							return sum;
						}, 0),
					};
				})
				.sort((a, b) => b.totalScore - a.totalScore)
				.map((item, i) => ({ ...item, place: i + 1 })),
		);
	}

	const compInfo = await getCompetitionInfo(compId);

	return [compInfo?.name || "", serieTeam];
};

function CalculateContestantsResults(
	results: [string, Record<Thlons, CompContestant[]>][],
	contestantsCountForCategory: Record<Thlons, Record<CategoryValues, number[]>>,
	SummedSerieContestants: Record<Thlons, SerieContestant[]>,
	serie: Series,
) {
	for (const key of Object.keys(Thlon) as Thlons[]) {
		for (const [compName, compContestant] of results) {
			AssingAmountOfContestantsInCategory(
				contestantsCountForCategory,
				key,
				compContestant,
			);

			for (const contestant of compContestant[key]) {
				const existing = SummedSerieContestants[key].find(
					(x) =>
						x.name.toLowerCase() === contestant.name.toLowerCase() &&
						x.category === contestant.category,
				);
				if (existing) {
					existing.compPlacements.push({
						compName,
						place: contestant.place,
						score: contestant.totalScore,
					});
				} else {
					SummedSerieContestants[key].push({
						...contestant,
						compPlacements: [
							{
								compName,
								place: contestant.place,
								score: contestant.totalScore,
							},
						],
					});
				}
			}
		}

		const contestantsWithMissingCompetitions = SummedSerieContestants[
			key
		].filter((x) => x.compPlacements.length < serie.competitionIds.length);

		for (const contestant of contestantsWithMissingCompetitions) {
			const missingComps = results
				.filter(
					([name]) =>
						!contestant.compPlacements.map((x) => x.compName).includes(name),
				)
				.map(([name]) => name);

			let categoryKey = contestant.category;
			if (key === "distance" || key === "multi") {
				if (categoryKey === "Junior") categoryKey = Categories.Man;
				if (categoryKey === "Juniorka") categoryKey = "Kobieta";
			}

			for (const missingComp of missingComps) {
				contestant.compPlacements.push({
					compName: missingComp,
					place: Math.max(...contestantsCountForCategory[key][categoryKey]) + 1,
					score: 0,
				});
			}
		}
	}
}

function AssingAmountOfContestantsInCategory(
	contestantsCountForCategory: Record<Thlons, Record<CategoryValues, number[]>>,
	key: Thlons,
	compContestant: Record<Thlons, CompContestant[]>,
) {
	contestantsCountForCategory[key].Junior.push(
		compContestant[key].filter((x) => x.category === Categories.Junior).length,
	);

	contestantsCountForCategory[key].Juniorka.push(
		compContestant[key].filter((x) => x.category === Categories.Juniorka)
			.length,
	);

	contestantsCountForCategory[key][Categories.Man].push(
		compContestant[key].filter((x) => {
			if (key === "distance" || key === "multi")
				return (
					x.category === Categories.Man || x.category === Categories.Junior
				);
			return x.category === Categories.Man;
		}).length,
	);
	contestantsCountForCategory[key].Kobieta.push(
		compContestant[key].filter((x) => {
			if (key === "distance" || key === "multi")
				return (
					x.category === Categories.Kobieta ||
					x.category === Categories.Juniorka
				);
			return x.category === Categories.Kobieta;
		}).length,
	);
}

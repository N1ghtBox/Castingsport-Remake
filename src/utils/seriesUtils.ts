import pLimit from "p-limit";
import { v4 as uuid } from "uuid";
import ProgramConsts from "@/consts/Consts";
import { Categories, type CategoryValues, Thlon } from "@/types/Contestant";
import type {
	CompetitionContestantResult,
	CompetitionFinalContestantResults,
	CompetitionTeamResult,
	SerieContestantResult,
	SerieFinalContestantResults,
	SerieFinalTeamsResults,
	Series,
	SerieTeamResult,
} from "@/types/Series";
import { TeamCategory } from "@/types/Teams";
import { GetThlonResult, GetThlonResultFromThlon } from "./contestUtils";
import { AddPlace } from "./convertUtils";
import {
	ByPartOfTeam,
	ByTakesPartInThlon,
	ByTeamCategory,
} from "./filterUtils";
import {
	getCompData,
	getCompetitionInfo,
	getGeneralData,
	updateGeneralData,
} from "./jsonUtils";
import { sortByTotal, sortSeriesResults } from "./sortUtils";
import type { ValueOf, WithoutPlace } from "./typeUtils";

type Thlons = keyof typeof Thlon;

const limit = pLimit(ProgramConsts.DefaultSeriesConcurrency);

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

export const calculateSerieTeamScores = async (
	serie: Series,
): Promise<SerieFinalTeamsResults> => {
	let teamResults = await Promise.all(
		serie.competitionIds.map((id) => limit(() => getCompetitionTeamScores(id))),
	);

	teamResults = teamResults.sort((a, b) => a[0].localeCompare(b[0]));

	const SummedSerieTeams: SerieTeamResult[] = [];
	const SummedSerieTeamsCount: Record<
		ValueOf<typeof TeamCategory>,
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
						{ competitionName: comp, place: team.place, score: team.total },
					],
				});
			else
				existing.placements.push({
					competitionName: comp,
					place: team.place,
					score: team.total,
				});
		}
	}

	const teamsWithMissingCompetitions = SummedSerieTeams.filter(
		(x) => x.placements.length < serie.competitionIds.length,
	);

	for (const team of teamsWithMissingCompetitions) {
		const missingComps = teamResults
			.filter(
				([name]) =>
					!team.placements.map((x) => x.competitionName).includes(name),
			)
			.map(([name]) => name);

		for (const missingComp of missingComps) {
			team.placements.push({
				competitionName: missingComp,
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
		place: team.placements.reduce((sum, item) => sum + item.place, 0),
		total: team.placements.reduce((sum, item) => sum + item.score, 0),
	})).sort((a, b) => {
		if (a.place !== b.place) {
			return a.place - b.place;
		}
		return b.total - a.total;
	});
};

export const calculateSerieScores = async (serie: Series) => {
	let results = await Promise.all(
		serie.competitionIds.map((id) => limit(() => getCompetitionScores(id))),
	);

	results = results.sort((a, b) => a[0].localeCompare(b[0]));

	const SummedSerieContestants: SerieFinalContestantResults = {
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
		Object.entries(SummedSerieContestants) as [
			Thlons,
			SerieContestantResult[],
		][]
	).reduce((prev, [thlon, contenstants]) => {
		prev[thlon] = contenstants
			.map((con) => ({
				id: con.id,
				name: con.name,
				category: con.category,
				club: con.club,
				placements: con.placements,
				total: con.placements.reduce((prev, curr) => prev + curr.score, 0),
				place: con.placements.reduce((prev, curr) => prev + curr.place, 0),
			}))
			.sort(sortSeriesResults);

		return prev;
	}, {} as SerieFinalContestantResults);
};

const getCompetitionScores = async (
	compId: string,
): Promise<[string, CompetitionFinalContestantResults]> => {
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

	const serieContestants: CompetitionFinalContestantResults = {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	};

	for (const [thlonKey, thlon] of Object.entries(Thlon) as [Thlons, Thlon][]) {
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
				.filter(ByTakesPartInThlon(thlon))
				.map((con) => {
					return {
						...con,
						total: GetThlonResult(con, thlon.from, thlon.to),
					};
				})
				.sort(sortByTotal)
				.map(AddPlace);

			serieContestants[thlonKey].push(...categoryResults);
		}
	}

	return [comp.name, serieContestants];
};

const getCompetitionTeamScores = async (
	compId: string,
): Promise<[string, CompetitionTeamResult[]]> => {
	const comp = await getCompData(compId);
	if (!comp) return ["", []];
	const { teams, contestants } = comp;

	const serieTeam: CompetitionTeamResult[] = [];

	for (const [_, categoryValue] of Object.entries(TeamCategory)) {
		serieTeam.push(
			...teams
				.filter(ByTeamCategory(categoryValue))
				.map((team) => {
					const teamContestants = contestants.filter(ByPartOfTeam(team));

					return {
						...team,
						total: teamContestants.reduce((sum, item) => {
							if (categoryValue === "Młodzieży")
								sum += GetThlonResultFromThlon(item, "3boj");
							else sum += GetThlonResultFromThlon(item, "5boj");
							return sum;
						}, 0),
					} as WithoutPlace<CompetitionTeamResult>;
				})
				.sort(sortByTotal)
				.map(AddPlace),
		);
	}

	const compInfo = await getCompetitionInfo(compId);

	return [compInfo?.name || "", serieTeam];
};

function CalculateContestantsResults(
	results: [string, Record<Thlons, CompetitionContestantResult[]>][],
	contestantsCountForCategory: Record<Thlons, Record<CategoryValues, number[]>>,
	SummedSerieContestants: Record<Thlons, SerieContestantResult[]>,
	serie: Series,
) {
	for (const key of Object.keys(Thlon) as Thlons[]) {
		for (const [compName, compContestant] of results) {
			AssignAmountOfContestantsInCategory(
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
					existing.placements.push({
						competitionName: compName,
						place: contestant.place,
						score: contestant.total,
					});
				} else {
					SummedSerieContestants[key].push({
						...contestant,
						placements: [
							{
								competitionName: compName,
								place: contestant.place,
								score: contestant.total,
							},
						],
					});
				}
			}
		}

		const contestantsWithMissingCompetitions = SummedSerieContestants[
			key
		].filter((x) => x.placements.length < serie.competitionIds.length);

		for (const contestant of contestantsWithMissingCompetitions) {
			const missingComps = results
				.filter(
					([name]) =>
						!contestant.placements.map((x) => x.competitionName).includes(name),
				)
				.map(([name]) => name);

			let categoryKey = contestant.category;
			if (key === "distance" || key === "multi") {
				if (categoryKey === "Junior") categoryKey = Categories.Man;
				if (categoryKey === "Juniorka") categoryKey = "Kobieta";
			}

			for (const missingComp of missingComps) {
				contestant.placements.push({
					competitionName: missingComp,
					place: Math.max(...contestantsCountForCategory[key][categoryKey]) + 1,
					score: 0,
				});
			}
		}
	}
}

function AssignAmountOfContestantsInCategory(
	contestantsCountForCategory: Record<Thlons, Record<CategoryValues, number[]>>,
	key: Thlons,
	compContestant: Record<Thlons, CompetitionContestantResult[]>,
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

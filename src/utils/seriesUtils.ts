import ProgramConsts from "@/consts/Consts";
import { Categories, type CategoryValues, Thlon } from "@/types/Contestant";
import type {
	CompetitionContestantResult,
	CompetitionFinalContestantResults,
	CompetitionTeamResult,
	ForEachThlon,
	SerieContestantResult,
	SerieFinalContestantResults,
	SerieFinalTeamsResults,
	Series,
	SerieTeamResult,
} from "@/types/Series";
import { TeamCategory } from "@/types/Teams";
import pLimit from "p-limit";
import { v4 as uuid } from "uuid";
import { GetThlonResult, GetThlonResultFromThlon } from "./contestUtils";
import { AddPlace, AddTotalAndPlaceFromPlacements } from "./convertUtils";
import {
	ByContestantCategoryInThlon,
	ByPartOfTeam,
	ByTakesPartInThlon,
	ByTeamCategory,
	chainFilters,
} from "./filterUtils";
import {
	getCompData,
	getCompetitionInfo,
	getGeneralData,
	updateGeneralData,
} from "./jsonUtils";
import { sortByTotal, sortSeriesResults } from "./sortUtils";
import type { ValueOf, WithoutPlace } from "./typeUtils";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";

type Thlons = keyof typeof Thlon;

const limit = pLimit(ProgramConsts.DefaultSeriesConcurrency);

export const updateSeries = async (
	id: string,
	series: Omit<Series, "id">,
): Promise<void> => {
	LoggingProvider.LogData(`Updating data for Series = ${id}`, series);

	const contents = await getGeneralData();

	const seriesToUpdate = contents.series.find(x => x.id === id)

	if (!seriesToUpdate) {
		LoggingProvider.LogWarning(`Series with id = ${id} was not found.`);
		return;
	}

	seriesToUpdate.name = series.name
	seriesToUpdate.type = series.type
	seriesToUpdate.competitionIds = series.competitionIds
	seriesToUpdate.year = series.year

	await updateGeneralData(contents);
	LoggingProvider.LogWarning(`Series with id = ${id} was updated.`);

};

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
	}))
		.map(AddTotalAndPlaceFromPlacements)
		.sort((a, b) => {
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


	CalculateContestantsResults(
		results,
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
				girl: con.girl,
				club: con.club,
				placements: con.placements,
			}))
			.map(AddTotalAndPlaceFromPlacements)
			.sort(sortSeriesResults(serie.type ?? 'Puchar'));

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
			const categoryResults = contestants
				.filter(
					chainFilters(
						ByContestantCategoryInThlon(categoryValue, thlon),
						ByTakesPartInThlon(thlon))
				)
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
	results: [string, ForEachThlon<CompetitionContestantResult[]>][],
	serieContestants: ForEachThlon<SerieContestantResult[]>,
	serie: Series,
) {
	for (const key of Object.keys(Thlon) as Thlons[]) {
		for (const [compName, compContestant] of results) {
			for (const contestant of compContestant[key]) {
				AssignPlacements(serieContestants[key], contestant, compName);
			}
		}

		AddMissingCompetitions(serieContestants, key, serie, results);
	}
}

function AddMissingCompetitions(
	serieContestants: ForEachThlon<SerieContestantResult[]>,
	key: Thlons,
	serie: Series,
	results: [string, ForEachThlon<CompetitionContestantResult[]>][]) {
	const contestantsWithMissingCompetitions = serieContestants[key].filter((x) => x.placements.length < serie.competitionIds.length);

	for (const contestant of contestantsWithMissingCompetitions) {
		const missingComps = results
			.filter(
				([name]) => !contestant.placements
					.map(({ competitionName }) => competitionName)
					.includes(name)
			)
			.map(([name]) => name);


		for (const missingComp of missingComps) {

			const resultsOfMissingCompetition = results
				.find(([name]) => name === missingComp)?.[1];

			if (!resultsOfMissingCompetition) continue;

			const count = resultsOfMissingCompetition[key]
				.filter(ByContestantCategoryInThlon(contestant.category, Thlon[key])).length;

			contestant.placements.push({
				competitionName: missingComp,
				place: count + 1,
				score: 0,
			});
		}
	}
}

function AssignPlacements(serieContestants: SerieContestantResult[], contestant: CompetitionContestantResult, compName: string) {
	const existing = serieContestants.find(
		(x) => x.name.toLowerCase() === contestant.name.toLowerCase() &&
			x.category === contestant.category
	);
	if (existing) {
		existing.placements.push({
			competitionName: compName,
			place: contestant.place,
			score: contestant.total,
		});
	} else {
		serieContestants.push({
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


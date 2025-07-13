import pLimit from "p-limit";
import { v4 as uuid } from "uuid";
import {
	Categories,
	type CategoryValues,
	type Contestant,
} from "@/types/Contestant";
import type { Series } from "@/types/Series";
import { GetThlonResultFromThlon } from "./contestUtils";
import { getCompData, getGeneralData, updateGeneralData } from "./jsonUtils";

const concurrency = 5; // adjust based on testing

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
> & { compPlacements: { compName: string; place: number; score: number }[] };

export const calculateSerieScores = async (serie: Series) => {
	const results = await Promise.all(
		serie.competitionIds.map((id) => limit(() => getCompetitionScores(id))),
	);

	const SummedSerieContestants: SerieContestant[] = [];

	const contestantsCountForCategory: Record<CategoryValues, number[]> = {
		[Categories.Junior]: [],
		[Categories.Juniorka]: [],
		[Categories.Man]: [],
		[Categories.Kobieta]: [],
		[Categories.Unknown]: [],
	};

	for (const [compName, compContestant] of results) {
		contestantsCountForCategory.Junior.push(
			compContestant.filter((x) => x.category === Categories.Junior).length,
		);
		contestantsCountForCategory.Juniorka.push(
			compContestant.filter((x) => x.category === Categories.Juniorka).length,
		);
		contestantsCountForCategory[Categories.Man].push(
			compContestant.filter((x) => x.category === Categories.Man).length,
		);
		contestantsCountForCategory.Kobieta.push(
			compContestant.filter((x) => x.category === Categories.Kobieta).length,
		);
		for (const contestant of compContestant) {
			const existing = SummedSerieContestants.find(
				(x) => x.name === contestant.name && x.category === contestant.category,
			);
			if (existing) {
				existing.compPlacements.push({
					compName,
					place: contestant.place,
					score: contestant.totalScore,
				});
			} else {
				SummedSerieContestants.push({
					...contestant,
					compPlacements: [
						{ compName, place: contestant.place, score: contestant.totalScore },
					],
				});
			}
		}
	}

	const contestantsWithMissingCompetitions = SummedSerieContestants.filter(
		(x) => x.compPlacements.length < serie.competitionIds.length,
	);

	for (const contestant of contestantsWithMissingCompetitions) {
		const missingComps = results
			.filter(
				([name]) =>
					!contestant.compPlacements.map((x) => x.compName).includes(name),
			)
			.map(([name]) => name);

		for (const missingComp of missingComps) {
			contestant.compPlacements.push({
				compName: missingComp,
				place: Math.max(...contestantsCountForCategory[contestant.category]) + 1,
				score: 0,
			});
		}
	}

	return SummedSerieContestants.map((con) => ({
		id: con.id,
		name: con.name,
		category: con.category,
		club: con.club,
		compPlacements: con.compPlacements,
		totalScore: con.compPlacements.reduce((prev, curr) => prev + curr.score, 0),
		totalPlace: con.compPlacements.reduce((prev, curr) => prev + curr.place, 0),
	}))
		.sort((a, b) => {
			if (a.totalPlace !== b.totalPlace) {
				return a.totalPlace - b.totalPlace;
			}
			return b.totalScore - a.totalScore;
		}) as Omit<SummedSerieContestant, 'seriePlace'>[];
};

const getCompetitionScores = async (
	compId: string,
): Promise<[string, CompContestant[]]> => {
	const comp = await getCompData(compId);
	if (!comp) return ["", []];
	const { contestants } = comp;

	const contestantsGroupedByCategory = contestants.reduce(
		(prev, curr) => {
			if (!prev.get(curr.category)) prev.set(curr.category, []);
			prev.get(curr.category)?.push(curr);
			return prev;
		},
		new Map() as Map<CategoryValues, Contestant[]>,
	);

	const serieContestants: CompContestant[] = [];

	for (const [_, contestants] of contestantsGroupedByCategory.entries()) {
		const categoryResults = contestants
			.map((con) => {
				return {
					...con,
					totalScore: GetThlonResultFromThlon(con, "5boj"),
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

		serieContestants.push(...categoryResults);
	}

	return [comp.name, serieContestants];
};

import pLimit from "p-limit";
import { v4 as uuid } from "uuid";
import {
	Categories,
	type CategoryValues,
	type Contestant,
	Thlon,
} from "@/types/Contestant";
import type { Series } from "@/types/Series";
import { GetThlonResult, TakesPartInContests } from "./contestUtils";
import { getCompData, getGeneralData, updateGeneralData } from "./jsonUtils";

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

export const calculateSerieScores = async (
	serie: Series,
) => {
	const results = await Promise.all(
		serie.competitionIds.map((id) =>
			limit(() => getCompetitionScores(id)),
		),
	);

	const SummedSerieContestants: Record<Thlons, SerieContestant[]> = {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	};

	const contestantsCountForCategory = Object.keys(Thlon).reduce((prev, curr) => {
		prev[curr as Thlons] = {
			[Categories.Junior]: [],
			[Categories.Juniorka]: [],
			[Categories.Man]: [],
			[Categories.Kobieta]: [],
			[Categories.Unknown]: []
		}

		return prev
	}, {} as Record<Thlons, Record<CategoryValues, number[]>>);

	for (const key of Object.keys(Thlon) as Thlons[]) {
		for (const [compName, compContestant] of results) {

			AssingAmountOfContestantsInCategory(contestantsCountForCategory, key, compContestant);

			for (const contestant of compContestant[key]) {
				const existing = SummedSerieContestants[key].find(
					(x) => x.name === contestant.name && x.category === contestant.category,
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
							{ compName, place: contestant.place, score: contestant.totalScore },
						],
					});
				}
			}
		}

		const contestantsWithMissingCompetitions = SummedSerieContestants[key].filter(
			(x) => x.compPlacements.length < serie.competitionIds.length,
		);

		for (const contestant of contestantsWithMissingCompetitions) {
			const missingComps = results
				.filter(
					([name]) =>
						!contestant.compPlacements.map((x) => x.compName).includes(name),
				)
				.map(([name]) => name);

			let categoryKey = contestant.category
			if (key === 'distance' || key === 'multi') {
				if (categoryKey === 'Junior') categoryKey = 'Mężczyzna'
				if (categoryKey === 'Juniorka') categoryKey = 'Kobieta'
			}

			for (const missingComp of missingComps) {
				contestant.compPlacements.push({
					compName: missingComp,
					place:
						Math.max(...contestantsCountForCategory[key][categoryKey]) + 1,
					score: 0,
				});
			}
		}
	}

	return (Object.entries(SummedSerieContestants) as [Thlons, SerieContestant[]][])
		.reduce((prev, [thlon, contenstants]) => {
			prev[thlon] = contenstants.map(con => ({
				id: con.id,
				name: con.name,
				category: con.category,
				club: con.club,
				compPlacements: con.compPlacements,
				totalScore: con.compPlacements.reduce((prev, curr) => prev + curr.score, 0),
				totalPlace: con.compPlacements.reduce((prev, curr) => prev + curr.place, 0),
			})).sort((a, b) => {
				if (a.totalPlace !== b.totalPlace) {
					return a.totalPlace - b.totalPlace;
				}
				return b.totalScore - a.totalScore;
			})

			return prev
		}, {} as Record<Thlons, Omit<SummedSerieContestant, "seriePlace">[]>)

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

	for (const [thlonKey, thlon] of Object.entries(Thlon) as [Thlons, typeof Thlon.multi][]) {
		for (const categoryValue of Object.values(Categories) as CategoryValues[]) {
			const compContestants = contestants.filter(x => {
				if (thlonKey === 'distance' || thlonKey === 'multi') {
					if (x.category === 'Junior') return categoryValue === 'Mężczyzna'
					if (x.category === 'Juniorka') return categoryValue === 'Kobieta'
				}
				return x.category === categoryValue
			})
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
function AssingAmountOfContestantsInCategory(contestantsCountForCategory: Record<Thlons, Record<CategoryValues, number[]>>, key: Thlons, compContestant: Record<Thlons, CompContestant[]>) {
	contestantsCountForCategory[key].Junior.push(
		compContestant[key].filter((x) => x.category === Categories.Junior)
			.length
	);

	contestantsCountForCategory[key].Juniorka.push(
		compContestant[key].filter((x) => x.category === Categories.Juniorka)
			.length
	);

	contestantsCountForCategory[key][Categories.Man].push(
		compContestant[key].filter((x) => {
			if (key === 'distance' || key === 'multi')
				return x.category === Categories.Man || x.category === Categories.Junior;
			return x.category === Categories.Man;
		})
			.length
	);
	contestantsCountForCategory[key].Kobieta.push(
		compContestant[key].filter((x) => {
			if (key === 'distance' || key === 'multi')
				return x.category === Categories.Kobieta || x.category === Categories.Juniorka;
			return x.category === Categories.Kobieta;
		})
			.length
	);
}


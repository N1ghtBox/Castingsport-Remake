import type { CategoryValues, Contestant } from "@/types/Contestant";
import type { Series } from "@/types/Series";
import pLimit from 'p-limit';
import { v4 as uuid } from 'uuid';
import { GetThlonResultFromThlon } from "./contestUtils";
import { getCompData, getGeneralData, updateGeneralData } from "./jsonUtils";

const concurrency = 5; // adjust based on testing

const limit = pLimit(concurrency);

export const createSeries = async (series: Omit<Series, 'id'>): Promise<string> => {
    const id = uuid()

    const contents = await getGeneralData();

    contents.series.push({ ...series, id })

    await updateGeneralData(contents)

    return id
}

export const getSerieData = async (id: Series['id']): Promise<Series | undefined> => {
    const { series } = await getGeneralData();

    return series.find(x => x.id === id)
}

type SerieContestant = Pick<Contestant, 'name' | 'category' | 'club'> & { totalScore: number, place: number }

export const calculateSerieScores = async (serie: Series) => {
    const results = await Promise.all(
        serie.competitionIds.map(id => limit(() => getCompetitionScores(id)))
    );
    console.log(results)
}

const getCompetitionScores = async (compId: string): Promise<[string, SerieContestant[]]> => {
    const comp = await getCompData(compId)
    if (!comp) return ["", []]
    const { contestants } = comp

    const contestantsGroupedByCategory = contestants.reduce((prev, curr) => {
        if (!prev.get(curr.category)) prev.set(curr.category, [])
        prev.get(curr.category)?.push(curr)
        return prev
    }, new Map() as Map<CategoryValues, Contestant[]>)

    const serieContestants: SerieContestant[] = []

    for (const [_, contestants] of contestantsGroupedByCategory.entries()) {
        const categoryResults = contestants.map(con => {
            return {
                ...con,
                totalScore: GetThlonResultFromThlon(con, '5boj')
            }
        })
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((con, i) => ({
                name: con.name,
                category:
                    con.category,
                club: con.category,
                totalScore: con.totalScore,
                place: i + 1
            }) as SerieContestant)

        serieContestants.push(...categoryResults)
    }

    return [comp.name, serieContestants]
}
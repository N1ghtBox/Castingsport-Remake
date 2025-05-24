import { CategoryValues, Contestant, Contests } from "@/types/Contestant";
import React, { createContext, useState } from "react";
import { useLoaderData } from "react-router";
import ContestWithDoubleScoreTable from "./ContestWithDoubleScore-Table/table";
import ContestWithTimeTable from "./ContestWithTime-Table/table";
import ContestWithMultiplierTable from "./ContestWitMutliplier-Table/table";
import type { ContestContextProps } from "@/types/ContestContext";
import { CompetitonContext } from "@/CompetitionLayout";
import { TakesPartInContest } from "@/utils/contestUtils";
import { v7 as uuid } from 'uuid'

export const ContestContext = createContext<ContestContextProps>({
    currentContestants: [],
    setCategoryFilter: () => { },
    category: undefined
});

export default function ContestScoreEditor() {
    const [categoryFilter, setCategoryFilter] = useState<CategoryValues | undefined>(undefined)
    const contestId = Number.parseInt(useLoaderData());
    const competition = React.useContext(CompetitonContext)

    React.useEffect(() => {
        if (!contestId || Number.isNaN(contestId))
            history.back()
    }, [contestId])

    const filterByContest = React.useCallback((contestant: Contestant) => {
        return TakesPartInContest(contestant, contestId)
    }, [contestId])

    const filterByCategory = React.useCallback((contestant: Contestant) => {
        if (!categoryFilter) return true
        return contestant.category === categoryFilter
    }, [categoryFilter])

    const table = React.useMemo(() => {
        if (contestId === Contests.FlyDistance ||
            contestId === Contests.FlyDistanceDoubleHand)
            return <ContestWithDoubleScoreTable key={uuid()} />

        if (contestId === Contests.Distance ||
            contestId === Contests.DistanceDoubleHand ||
            contestId === Contests.MultiDistance
        )
            return <ContestWithMultiplierTable key={uuid()} />

        if (contestId === Contests.Arenberg) return <ContestWithTimeTable scoreMutlipleOf={2} key={uuid()} />
        return <ContestWithTimeTable scoreMutlipleOf={5} key={uuid()} />
    }, [contestId, categoryFilter])

    return <ContestContext.Provider value={{
        currentContestants: competition
            .contestants
            .filter(filterByContest)
            .filter(filterByCategory),
        setCategoryFilter: (category) => setCategoryFilter(category),
        category: categoryFilter
    }}>
        {table}
    </ContestContext.Provider >
}
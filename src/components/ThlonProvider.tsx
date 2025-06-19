import { CompetitonContext } from "@/CompetitionLayout";
import { ContestContext } from "@/types/ContestContext";
import type { CategoryValues } from "@/types/Contestant";
import { GetThlonResult, TakesPartInContests } from "@/utils/contestUtils";
import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";

const ThlonProvider = () => {
    const [categoryFilter, setCategoryFilter] = useState<CategoryValues | undefined>("Junior")
    const [contestMultiplier, setContestMultiplier] = useState<number | undefined>(undefined)
    const competition = React.useContext(CompetitonContext)
    const { from, to } = useLoaderData() as { from: number, to: number };

    const results = React.useMemo(() =>
        competition.contestants
            .filter((contestant) => TakesPartInContests(contestant, from, to))
            .filter((contestant) => {
                if (!categoryFilter) return true;
                return contestant.category === categoryFilter;
            })
            .map((contestant) => ({
                ...contestant,
                total: GetThlonResult(contestant, from, to)
            }))
            .sort((a, b) => b.total - a.total)
            .map((contestant, index) => ({
                ...contestant,
                place: index + 1,
            }))
        , [competition.contestants, from, to, categoryFilter]);

    return <ContestContext.Provider value={{
        currentContestants: results,
        setCategoryFilter: (category) => setCategoryFilter(category),
        category: categoryFilter,
        contestMultiplier: contestMultiplier,
        setContestMultiplier: (multiplier) => setContestMultiplier(multiplier)
    }}>
        <Outlet />
    </ContestContext.Provider >
};

export default ThlonProvider;

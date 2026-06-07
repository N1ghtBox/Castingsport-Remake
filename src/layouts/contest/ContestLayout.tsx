import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { ContestContext } from "@/context/contest/ContestContext";
import type { ContestContextProps } from "@/context/contest/ContestContext.types";
import { type CategoryValues, Contests } from "@/types/Contestant";
import {
    ByContestantCategory,
    ByTakesPart,
    chainFilters,
} from "@/utils/filterUtils";

const ContestLayout = () => {
    const [categoryFilter, setCategoryFilter] = useState<
        CategoryValues | undefined
    >(undefined);
    const loaderContestId = Number.parseInt(useLoaderData(), 10);

    const [contestId, setContestId] = useState<Contests>(Contests.FlySkish);
    const { setTab, contestants } = useCompetitionContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: brak
    React.useEffect(() => {
        setTab(loaderContestId);
    }, []);

    React.useEffect(() => {
        if (!loaderContestId || Number.isNaN(loaderContestId)) {
            return history.back();
        }

        setContestId(loaderContestId as Contests);
    }, [loaderContestId]);

    return (
        <ContestContext.Provider
            value={
                {
                    currentContestants: contestants.filter(
                        chainFilters(
                            ByTakesPart(contestId),
                            ByContestantCategory(categoryFilter, contestId),
                        ),
                    ),
                    category: categoryFilter,
                    setCategoryFilter: setCategoryFilter,
                    contestId,
                } as ContestContextProps
            }>
            <Outlet />
        </ContestContext.Provider>
    );
};

export default ContestLayout;

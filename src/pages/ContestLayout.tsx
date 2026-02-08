import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { ContestContext } from "@/context/contest/ContestContext";
import type { ContestContextProps } from "@/context/contest/ContestContext.types";
import type { CategoryValues } from "@/types/Contestant";
import {
	ByContestantCategory,
	ByTakesPart,
	chainFilters,
} from "@/utils/filterUtils";

const ContestLayout = () => {
	const [categoryFilter, setCategoryFilter] = useState<
		CategoryValues | undefined
	>(undefined);
	const [contestMultiplier, setContestMultiplier] = useState<
		number | undefined
	>(undefined);
	const contestId = Number.parseInt(useLoaderData());
	const { setTab, contestants } = useCompetitionContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: brak
	React.useEffect(() => {
		setTab(contestId);
	}, []);

	React.useEffect(() => {
		if (!contestId || Number.isNaN(contestId)) history.back();
	}, [contestId]);

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
					contestMultiplier: contestMultiplier,
					setCategoryFilter: setCategoryFilter,
					setContestMultiplier: setContestMultiplier,
				} as ContestContextProps
			}>
			<Outlet />
		</ContestContext.Provider>
	);
};

export default ContestLayout;

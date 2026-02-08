import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { ContestContext } from "@/context/contest/ContestContext";
import type { ContestContextProps } from "@/context/contest/ContestContext.types";
import type { CategoryValues, Thlon } from "@/types/Contestant";
import { AddPlace, AddTotal } from "@/utils/convertUtils";
import {
	ByContestantCategoryInThlon,
	ByTakesPartInThlon,
	chainFilters,
} from "@/utils/filterUtils";
import { sortByTotal } from "@/utils/sortUtils";

const ThlonProvider = () => {
	const [categoryFilter, setCategoryFilter] = useState<
		CategoryValues | undefined
	>("Junior");
	const [contestMultiplier, setContestMultiplier] = useState<
		number | undefined
	>(undefined);
	const { contestants } = useCompetitionContext();
	const { from, to } = useLoaderData() as Thlon;

	const results = React.useMemo(
		() =>
			contestants
				.filter(
					chainFilters(
						ByContestantCategoryInThlon(categoryFilter, { from, to }),
						ByTakesPartInThlon({ from, to }),
					),
				)
				.map(AddTotal(from, to))
				.sort(sortByTotal)
				.map(AddPlace),
		[contestants, from, to, categoryFilter],
	);

	return (
		<ContestContext.Provider
			value={
				{
					currentContestants: results,
					setCategoryFilter: (category) => setCategoryFilter(category),
					category: categoryFilter,
					contestMultiplier: contestMultiplier,
					setContestMultiplier: (multiplier) =>
						setContestMultiplier(multiplier),
				} as ContestContextProps
			}>
			<Outlet />
		</ContestContext.Provider>
	);
};

export default ThlonProvider;

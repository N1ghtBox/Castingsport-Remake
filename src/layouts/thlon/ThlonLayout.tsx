import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { ThlonContext } from "@/context/thlon/ThlonContext";
import type { ThlonContextProps } from "@/context/thlon/ThlonContext.types";
import type { CategoryValues, Thlon } from "@/types/Contestant";
import { AddPlace, AddTotal } from "@/utils/convertUtils";
import {
	ByContestantCategoryInThlon,
	ByTakesPartInThlon,
	chainFilters,
} from "@/utils/filterUtils";
import { sortByTotal } from "@/utils/sortUtils";

const ThlonLayout = () => {
	const [categoryFilter, setCategoryFilter] = useState<
		CategoryValues | undefined
	>("Junior");
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
		<ThlonContext.Provider
			value={
				{
					results,
					setCategoryFilter: (category) => setCategoryFilter(category),
					category: categoryFilter,
					thlon: { from, to },
				} as ThlonContextProps
			}>
			<Outlet />
		</ThlonContext.Provider>
	);
};

export default ThlonLayout;

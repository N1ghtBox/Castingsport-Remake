import { CompetitonContext } from "@/types/CompetitionContext";
import {
	Contests,
	type CategoryValues,
	type Contestant,
} from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { TakesPartInContest } from "@/utils/contestUtils";
import React from "react";
import { useState } from "react";
import { Outlet, useLoaderData } from "react-router";

const ContestLayout = () => {
	const [categoryFilter, setCategoryFilter] = useState<
		CategoryValues | undefined
	>(undefined);
	const [contestMultiplier, setContestMultiplier] = useState<
		number | undefined
	>(undefined);
	const contestId = Number.parseInt(useLoaderData());
	const competition = React.useContext(CompetitonContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		competition.setTab(contestId);
	}, []);

	React.useEffect(() => {
		if (!contestId || Number.isNaN(contestId)) history.back();
	}, [contestId]);

	const filterByContest = React.useCallback(
		(contestant: Contestant) => {
			return TakesPartInContest(contestant, contestId);
		},
		[contestId],
	);

	const filterByCategory = React.useCallback(
		(contestant: Contestant) => {
			if (!categoryFilter) return true;
			let localContestantCategory = contestant.category;
			if (
				contestId === Contests.MultiSkish ||
				contestId === Contests.MultiDistance ||
				contestId === Contests.FlyDistanceDoubleHand ||
				contestId === Contests.DistanceDoubleHand
			)
				localContestantCategory =
					contestant.category === "Junior" ||
					contestant.category === "Mężczyzna"
						? "Mężczyzna"
						: "Kobieta";

			return localContestantCategory === categoryFilter;
		},
		[categoryFilter, contestId],
	);

	return (
		<ContestContext.Provider
			value={{
				currentContestants: competition.contestants
					.filter(filterByContest)
					.filter(filterByCategory),
				setCategoryFilter: (category) => setCategoryFilter(category),
				category: categoryFilter,
				contestMultiplier: contestMultiplier,
				setContestMultiplier: (multiplier) => setContestMultiplier(multiplier),
			}}>
			<Outlet />
		</ContestContext.Provider>
	);
};

export default ContestLayout;

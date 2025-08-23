import React, { useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { CompetitonContext } from "@/types/CompetitionContext";
import { Categories, type CategoryValues, Contests } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { GetThlonResult, TakesPartInContests } from "@/utils/contestUtils";

const ThlonProvider = () => {
	const [categoryFilter, setCategoryFilter] = useState<
		CategoryValues | undefined
	>("Junior");
	const [contestMultiplier, setContestMultiplier] = useState<
		number | undefined
	>(undefined);
	const competition = React.useContext(CompetitonContext);
	const { from, to } = useLoaderData() as { from: number; to: number };

	const results = React.useMemo(
		() =>
			competition.contestants
				.filter((contestant) => TakesPartInContests(contestant, from, to))
				.filter((contestant) => {
					if (!categoryFilter) return true;
					let localContestantCategory = contestant.category;
					if (from < Contests.Arenberg) {
						localContestantCategory = localContestantCategory === Categories.Kadet
							? contestant.girl ? Categories.Juniorka : Categories.Junior
							: localContestantCategory
					}
					if (from > Contests.Distance) {
						localContestantCategory =
							localContestantCategory === Categories.Junior ||
								localContestantCategory === Categories.Man
								? Categories.Man
								: Categories.Kobieta;
					}
					return localContestantCategory === categoryFilter;
				})
				.map((contestant) => ({
					...contestant,
					total: GetThlonResult(contestant, from, to),
				}))
				.sort((a, b) => b.total - a.total)
				.map((contestant, index) => ({
					...contestant,
					place: index + 1,
				})),
		[competition.contestants, from, to, categoryFilter],
	);

	return (
		<ContestContext.Provider
			value={{
				currentContestants: results,
				setCategoryFilter: (category) => setCategoryFilter(category),
				category: categoryFilter,
				contestMultiplier: contestMultiplier,
				setContestMultiplier: (multiplier) => setContestMultiplier(multiplier),
			}}>
			<Outlet />
		</ContestContext.Provider>
	);
};

export default ThlonProvider;

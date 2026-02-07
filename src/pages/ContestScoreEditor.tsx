import React from "react";
import { useLoaderData } from "react-router";
import { v7 as uuid } from "uuid";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { Contests } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { TypeOfContest } from "@/utils/contestUtils";
import { ContestWithDoubleScore } from "./Competitions/ContestWithDoubleScore";
import { ContestWithTime } from "./Competitions/ContestWithTime";
import { ContestWithMultiplier } from "./Competitions/ContestWitMutliplier";

export default function ContestScoreEditor() {
	const contestId = Number.parseInt(useLoaderData());
	const competition = useCompetitionContext();
	const contest = React.useContext(ContestContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: No need
	const table = React.useMemo(() => {
		const contestType = TypeOfContest(contestId);

		if (contestType === "double") {
			contest.setContestMultiplier(undefined);
			return <ContestWithDoubleScore key={uuid()} />;
		}

		if (contestType === "single") {
			contest.setContestMultiplier(undefined);
			return <ContestWithMultiplier key={uuid()} />;
		}

		if (contestId === Contests.Arenberg) {
			contest.setContestMultiplier(2);
			return <ContestWithTime key={uuid()} />;
		}

		contest.setContestMultiplier(5);
		return <ContestWithTime key={uuid()} />;
	}, [contestId, contest.category, competition.contestants.length]);

	return table;
}

import React from "react";
import { useLoaderData } from "react-router";
import { v7 as uuid } from "uuid";
import { CompetitonContext } from "@/types/CompetitionContext";
import { Contests } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { TypeOfContest } from "@/utils/contestUtils";
import ContestWithDoubleScoreTable from "./Competitions/ContestWithDoubleScore-Table/table";
import ContestWithTimeTable from "./Competitions/ContestWithTime-Table/table";
import ContestWithMultiplierTable from "./Competitions/ContestWitMutliplier-Table/table";

export default function ContestScoreEditor() {
	const contestId = Number.parseInt(useLoaderData());
	const competition = React.useContext(CompetitonContext);
	const contest = React.useContext(ContestContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const table = React.useMemo(() => {
		const contestType = TypeOfContest(contestId);

		if (contestType === "double") {
			contest.setContestMultiplier(undefined);
			return <ContestWithDoubleScoreTable key={uuid()} />;
		}

		if (contestType === "single") {
			contest.setContestMultiplier(undefined);
			return <ContestWithMultiplierTable key={uuid()} />;
		}

		if (contestId === Contests.Arenberg) {
			contest.setContestMultiplier(2);
			return <ContestWithTimeTable key={uuid()} />;
		}

		contest.setContestMultiplier(5);
		return <ContestWithTimeTable key={uuid()} />;
	}, [contestId, contest.category, competition.contestants.length]);

	return table;
}

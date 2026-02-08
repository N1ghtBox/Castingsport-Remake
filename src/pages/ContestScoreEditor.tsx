import React from "react";
import { useLoaderData } from "react-router";
import { v7 as uuid } from "uuid";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import { Contests } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import { ContestWithDoubleScore } from "./Competitions/ContestWithDoubleScore";
import { ContestWithTime } from "./Competitions/ContestWithTime";
import { ContestWithMultiplier } from "./Competitions/ContestWitMutliplier";

export default function ContestScoreEditor() {
	const contestId = Number.parseInt(useLoaderData());
	const { contestants } = useCompetitionContext();
	const { setContestMultiplier, category } = useContestContext();

	// biome-ignore lint/correctness/useExhaustiveDependencies: No need
	const table = React.useMemo(() => {
		const contestType = TypeOfContest(contestId);

		if (contestType === "double") {
			setContestMultiplier(undefined);
			return <ContestWithDoubleScore key={uuid()} />;
		}

		if (contestType === "single") {
			setContestMultiplier(undefined);
			return <ContestWithMultiplier key={uuid()} />;
		}

		if (contestId === Contests.Arenberg) {
			setContestMultiplier(2);
			return <ContestWithTime key={uuid()} />;
		}

		setContestMultiplier(5);
		return <ContestWithTime key={uuid()} />;
	}, [contestId, category, contestants.length]);

	return table;
}

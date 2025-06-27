import { ContestContext } from "@/types/ContestContext";
import { Contests } from "@/types/Contestant";
import React from "react";
import { useLoaderData } from "react-router";
import { v7 as uuid } from 'uuid';
import ContestWithMultiplierTable from "./ContestWitMutliplier-Table/table";
import ContestWithDoubleScoreTable from "./ContestWithDoubleScore-Table/table";
import ContestWithTimeTable from "./ContestWithTime-Table/table";
import { TypeOfContest } from "@/utils/contestUtils";
import { CompetitonContext } from "@/types/CompetitionContext";


export default function ContestScoreEditor() {
    const contestId = Number.parseInt(useLoaderData());
    const competition = React.useContext(CompetitonContext)
    const contest = React.useContext(ContestContext)

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const table = React.useMemo(() => {
        const contestType = TypeOfContest(contestId)

        if (contestType === 'double') {
            contest.setContestMultiplier(undefined)
            return <ContestWithDoubleScoreTable key={uuid()} />
        }

        if (contestType === 'single') {
            contest.setContestMultiplier(undefined)
            return <ContestWithMultiplierTable key={uuid()} />
        }

        if (contestId === Contests.Arenberg) {
            contest.setContestMultiplier(2)
            return <ContestWithTimeTable key={uuid()} />
        }

        contest.setContestMultiplier(5)
        return <ContestWithTimeTable key={uuid()} />
    }, [contestId, contest.category, competition.contestants.length])

    return table
}
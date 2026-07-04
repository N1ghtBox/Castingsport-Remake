import { useContestContext } from "@/context/contest/ContestContext";
import { Contests } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import { ContestWithDoubleScore } from "./Competitions/ContestWithDoubleScore";
import { ContestWithTime } from "./Competitions/ContestWithTime";
import { ContestWithMultiplier } from "./Competitions/ContestWithMultiplier";

export default function ContestScoreEditor() {
	const { contestId } = useContestContext()

	const contestType = TypeOfContest(contestId);

	if (contestType === "double") {
		return <ContestWithDoubleScore />;
	}

	if (contestType === "single") {
		return <ContestWithMultiplier />;
	}

	if (contestId === Contests.Arenberg) {
		return <ContestWithTime contestMultiplier={2} />;
	}

	return <ContestWithTime contestMultiplier={5} />;
}

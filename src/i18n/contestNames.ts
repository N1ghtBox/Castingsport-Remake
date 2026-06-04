import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Contests } from "@/types/Contestant";

const CONTEST_KEY_MAP: Map<Contests, string> = new Map([
	[Contests.FlySkish, "contest.FlySkish"],
	[Contests.FlyDistance, "contest.FlyDistance"],
	[Contests.Arenberg, "contest.Arenberg"],
	[Contests.Skish, "contest.Skish"],
	[Contests.Distance, "contest.Distance"],
	[Contests.FlyDistanceDoubleHand, "contest.FlyDistanceDoubleHand"],
	[Contests.DistanceDoubleHand, "contest.DistanceDoubleHand"],
	[Contests.MultiSkish, "contest.MultiSkish"],
	[Contests.MultiDistance, "contest.MultiDistance"],
]);

export function getContestName(contest: Contests, t: TFunction): string {
	const key = CONTEST_KEY_MAP.get(contest);
	if (!key) return String(contest);
	return t(key);
}

export function useContestName() {
	const { t } = useTranslation();
	return (contest: Contests) => getContestName(contest, t);
}

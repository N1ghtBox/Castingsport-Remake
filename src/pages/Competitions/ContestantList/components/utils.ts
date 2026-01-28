import type { GridValueSetter } from "@mui/x-data-grid";
import { Contest, Contests, type Contestant, type Thlon } from "@/types/Contestant";
import { SetTakesPartInContests } from "@/utils/contestUtils";

export const contestSetter =
    (key: keyof typeof Thlon): GridValueSetter<Contestant & { isNew: boolean }> =>
        (value, row) => {
            return SetTakesPartInContests(
                SetTakesPartInContests(row, value, key),
                true,
                "3boj",
            );
        };

export const getDefaultContestList = (kadet: boolean): Array<Contest> => [
    { id: Contests.FlySkish, score: 0, takesPart: !kadet, total: 0, time: "" },
    { id: Contests.FlyDistance, score: 0, takesPart: !kadet, total: 0, time: "" },
    { id: Contests.Arenberg, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.Skish, score: 0, takesPart: true, total: 0, time: "" },
    { id: Contests.Distance, score: 0, takesPart: true, total: 0, time: "" },
    {
        id: Contests.FlyDistanceDoubleHand,
        score: 0,
        takesPart: false,
        total: 0,
        time: "",
    },
    {
        id: Contests.DistanceDoubleHand,
        score: 0,
        takesPart: false,
        total: 0,
        time: "",
    },
    { id: Contests.MultiSkish, score: 0, takesPart: false, total: 0, time: "" },
    {
        id: Contests.MultiDistance,
        score: 0,
        takesPart: false,
        total: 0,
        time: "",
    },
];

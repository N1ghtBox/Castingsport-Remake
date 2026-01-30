import {
    type Contest,
    Contests
} from "@/types/Contestant";

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

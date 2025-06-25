import { type Contestant, Contests } from "@/types/Contestant";
import type { TimelineContestant, TimelineData } from "@/types/TimelineData";
import { TakesPartInContest } from "@/utils/contestUtils";
import type { ExtractRecordValue } from "@/utils/typeUtils";

export const EVENT_ORDER = [
    Contests.FlySkish,
    Contests.Arenberg,
    Contests.Skish,
    Contests.FlyDistance,
    Contests.Distance,
    Contests.FlyDistanceDoubleHand,
    Contests.DistanceDoubleHand,
    Contests.MultiSkish,
    Contests.MultiDistance];

const PlatformConfig = {
    [Contests.FlySkish]: 6,
    [Contests.Arenberg]: 6,
    [Contests.Skish]: 6,
    [Contests.FlyDistance]: 4,
    [Contests.Distance]: 4,
    [Contests.MultiSkish]: 6,
    [Contests.FlyDistanceDoubleHand]: 2,
    [Contests.DistanceDoubleHand]: 2,
    [Contests.MultiDistance]: 2,
}

export function generateTimelineForEvent(contestants: Contestant[], event: Contests): ExtractRecordValue<TimelineData> {
    const sorted = contestants
        .filter(x => TakesPartInContest(x, event))
        .sort((a, b) => a.number - b.number)

    const eventRows: ExtractRecordValue<TimelineData> = {}

    const platformOrderCount: Record<number, number> = {}

    for (let i = 0; i < sorted.length; i++) {
        const contestant = sorted[i];
        const platformId = i % PlatformConfig[event] + 1
        if (!eventRows[platformId]) eventRows[platformId] = []
        if (!platformOrderCount[platformId]) platformOrderCount[platformId] = 1
        eventRows[platformId].push({
            ...contestant,
            order: platformOrderCount[platformId]++
        })
    }

    const indexOfEvent = EVENT_ORDER.indexOf(event)
    if (indexOfEvent < 0) {
        console.error("Failed to find event id ", event)
        return {}
    }

    const shift = indexOfEvent % PlatformConfig[event]

    return eventShift(eventRows, PlatformConfig[event], shift);
}

function eventShift(platformsWithContestants: ExtractRecordValue<TimelineData>, platformCount: number, shiftCount: number) {
    const shiftedPlatforms = platformShift(platformsWithContestants, platformCount, shiftCount)
    return contestantShift(shiftedPlatforms, shiftCount)
}

function platformShift(platformsWithContestants: ExtractRecordValue<TimelineData>, platformCount: number, shiftCount: number) {
    return Object.entries(platformsWithContestants)
        .reduce((acc, [key, values]) => {
            let newKey = Number(key) + shiftCount
            if (newKey >= platformCount) newKey = 1;
            acc[newKey] = values;
            return acc
        }, {} as ExtractRecordValue<TimelineData>)
}

function contestantShift(platformsWithContestants: ExtractRecordValue<TimelineData>, shiftCount: number) {
    return Object.entries(platformsWithContestants)
        .reduce((acc, [key, values]) => {
            const manArray = values.filter(x => x.category === 'Mężczyzna')
            const womanArray = values.filter(x => x.category === 'Kobieta')
            const boyArray = values.filter(x => x.category === 'Junior')
            const girlArray = values.filter(x => x.category === 'Juniorka')

            acc[Number(key)] = [
                ...arrayShift(manArray, shiftCount),
                ...arrayShift(womanArray, shiftCount),
                ...arrayShift(boyArray, shiftCount),
                ...arrayShift(girlArray, shiftCount),
            ]
            return acc
        }, {} as ExtractRecordValue<TimelineData>)
}

function arrayShift(contestants: TimelineContestant[], shiftCount: number) {
    const moved = contestants.splice(0, shiftCount);
    contestants.push(...moved);
    return contestants;
}


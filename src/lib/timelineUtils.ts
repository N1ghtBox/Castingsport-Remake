import { type Contestant, Contests } from "@/types/Contestant";
import type PlatformConfig from "@/types/PlatformConfig";
import type TimeConfig from "@/types/TimeConfig";
import type { TimelineContestant, TimelineData } from "@/types/TimelineData";
import { TakesPartInContest } from "@/utils/contestUtils";
import type { ExtractRecordValue } from "@/utils/typeUtils";
import type { Moment } from "moment";
import moment from "moment";

export const EVENT_ORDER = [
    Contests.FlySkish,
    Contests.Arenberg,
    Contests.Skish,
    Contests.FlyDistance,
    Contests.Distance,
    Contests.MultiSkish,
    Contests.FlyDistanceDoubleHand,
    Contests.DistanceDoubleHand,
    Contests.MultiDistance];


export const generateTimelineWithConfigs = (platformConfig: PlatformConfig) =>
    (contestants: Contestant[], event: Contests) => generateTimelineForEvent(contestants, event, platformConfig)

function generateTimelineForEvent(contestants: Contestant[], event: Contests, platformConfig: PlatformConfig): ExtractRecordValue<TimelineData> {
    const sorted = contestants
        .filter(x => TakesPartInContest(x, event))
        .sort((a, b) => a.number - b.number)

    const eventRows: ExtractRecordValue<TimelineData> = {}

    const platformOrderCount: Record<number, number> = {}

    for (let i = 0; i < sorted.length; i++) {
        const contestant = sorted[i];
        const platformId = i % platformConfig[event] + 1
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

    const shift = indexOfEvent % platformConfig[event]

    return eventShift(eventRows, platformConfig[event], shift);
}

function eventShift(platformsWithContestants: ExtractRecordValue<TimelineData>, platformCount: number, shiftCount: number) {
    const shiftedPlatforms = platformShift(platformsWithContestants, platformCount, shiftCount)
    return contestantShift(shiftedPlatforms, shiftCount)
}

function platformShift(platformsWithContestants: ExtractRecordValue<TimelineData>, platformCount: number, shiftCount: number) {
    return Object.entries(platformsWithContestants)
        .reduce((acc, [key, values]) => {
            let newKey = Number(key) + (shiftCount % platformCount)
            if (newKey > platformCount) newKey -= platformCount;
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

const EventTimeConfig = {
    [Contests.FlySkish]: 3,
    [Contests.Arenberg]: 4,
    [Contests.Skish]: 4,
    [Contests.FlyDistance]: 5,
    [Contests.Distance]: 3,
    [Contests.MultiSkish]: 6,
    [Contests.FlyDistanceDoubleHand]: 6,
    [Contests.DistanceDoubleHand]: 3,
    [Contests.MultiDistance]: 3,
}

const DEFAULT_EVENT_COOLDOWN = 20

function calculateEndOfEvent(startOfEvent: Moment, eventData: ExtractRecordValue<TimelineData>, event: Contests) {
    if (Object.values(eventData).length === 0) return startOfEvent
    const maxContestants = Math.max(...Object.values(eventData)
        .map(x => x.length))

    const endTime = moment(startOfEvent).add(maxContestants * (EventTimeConfig[event] + 1) + DEFAULT_EVENT_COOLDOWN, 'minutes')

    return roundTime(endTime)
}

function roundTime(time: Moment) {
    const rounded = moment(time).startOf('hour');

    if (time.minute() === 0)
        return rounded
    if (time.minute() < 30)
        return rounded.add(30, 'minutes'); // → round to :30
    return rounded.add(1, 'hour'); // → round to next full hour
}

export function generateTimeline(startOfEvent: Moment, data: TimelineData, timeConfig: TimeConfig) {
    const timeline: Partial<Record<Contests, Moment>> = {
        [Contests.FlySkish]: timeConfig[Contests.FlySkish] ? moment(timeConfig[Contests.FlySkish]) : startOfEvent.set({
            hour: 9,
            minute: 0,
            second: 0
        })
    }

    for (let i = 1; i < EVENT_ORDER.length; i++) {
        const event = EVENT_ORDER[i]
        if (event === Contests.FlySkish) continue

        const prevEvent = EVENT_ORDER[i - 1]
        if (!timeline[prevEvent]) {
            console.error("Nie znaleziono poprzedniego eventu")
            break
        }

        timeline[event] = timeConfig[event]
            ? moment(timeConfig[event])
            : calculateEndOfEvent(timeline[prevEvent], data[prevEvent], prevEvent).clone()
    }

    return timeline
}

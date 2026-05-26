import type { KeysOf, WithPlace, WithTotal } from "@/utils/typeUtils";
import type { CategoryValues, Contestant, Contests, Thlon } from "./Contestant";

export type SyncResultMap = Record<KeysOf<typeof Thlon>, CategoryValues[]>;

type SyncContestResults = Record<`contest-${Contests}`, string>

type CompetitionMetadata = {
    name: string,
    date: string
}

export type SyncContestantResult = Omit<WithPlace<WithTotal<Contestant>>, 'contests'> & SyncContestResults

export type SyncData = Record<
    KeysOf<typeof Thlon>,
    Partial<Record<CategoryValues, SyncContestantResult[]>>
> & CompetitionMetadata;

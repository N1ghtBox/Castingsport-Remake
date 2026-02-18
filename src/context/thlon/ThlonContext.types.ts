import type { CategoryValues, ContestWithResults, Thlon } from "@/types/Contestant";

export type ThlonContextProps = {
    results: Array<ContestWithResults>;
    category?: CategoryValues;
    setCategoryFilter: (category?: CategoryValues) => void;
    thlon: Thlon;
};

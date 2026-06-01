import type { ResultRow } from "@/pages/Print/ContestPrint/ContestResults";

export type FormProps = {
    callback: (count: number | undefined, data?: FormData) => void;
    id: string;
    results: ResultRow[];
    disabled?: boolean;
};

export type FormData =
    | {
        finals: {
            number: string;
            time: string;
            result: number;
        }[];
    }
    | undefined;

export type FormCallback = (
    count: number | undefined,
    data?: FormData,
) => void;

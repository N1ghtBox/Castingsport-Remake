import type { Action } from "@/utils/typeUtils";

export type BaseContextProps = {
    setLoading: Action<boolean>;
    loading: boolean;
    debugMode: boolean;
};

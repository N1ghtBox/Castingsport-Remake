import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { ThlonContextProps } from "./ThlonContext.types";

export const ThlonContext = React.createContext<unknown>(null);

export const useThlonContext = () => {
    return useGenericContext<ThlonContextProps>(ThlonContext);
};

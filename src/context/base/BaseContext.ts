import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { BaseContextProps } from "./BaseContext.types";

export const BaseContext = React.createContext<unknown>(null);

export const useBaseContext = () => {
    return useGenericContext<BaseContextProps>(BaseContext);
};

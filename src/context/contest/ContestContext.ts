import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { ContestContextProps } from "./ContestContext.types";

export const ContestContext = React.createContext<unknown>(null);

export const useContestContext = () => {
	return useGenericContext<ContestContextProps>(ContestContext);
};

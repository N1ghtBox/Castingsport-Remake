import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { CompetitionContextProps } from "./CompetitionContext.types";

export const CompetitionContext = React.createContext<unknown>(null);

export const useCompetitionContext = () => {
	return useGenericContext<CompetitionContextProps>(CompetitionContext);
};

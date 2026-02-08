import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { TeamContextProps } from "./TeamContext.types";

export const TeamContext = React.createContext<unknown>(null);

export const useTeamContext = () => {
	return useGenericContext<TeamContextProps>(TeamContext);
};

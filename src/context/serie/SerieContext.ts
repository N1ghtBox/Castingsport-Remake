import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { SerieContextProps } from "./SerieContext.types";

export const SerieContext = React.createContext<unknown>(null);

export const useSerieContext = () => {
	return useGenericContext<SerieContextProps>(SerieContext);
};

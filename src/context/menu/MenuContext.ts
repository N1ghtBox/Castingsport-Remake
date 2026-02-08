import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { MenuContextProps } from "./MenuContext.types";

export const MenuContext = React.createContext<unknown>(null);

export const useMenuContext = () => {
	return useGenericContext<MenuContextProps>(MenuContext);
};

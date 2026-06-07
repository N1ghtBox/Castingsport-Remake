import React from "react";
import { useGenericContext } from "@/hooks/use-generic-context";
import type { LicenseContextProps } from "./types";

export const LicenseContext = React.createContext<unknown>(null);

export const useLicenseContext = () => {
    return useGenericContext<LicenseContextProps>(LicenseContext);
};

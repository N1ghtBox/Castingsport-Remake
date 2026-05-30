import { createContext } from "react";
import type { LicenseContextProps } from "./types";

export const LicenseContext = createContext<LicenseContextProps | null>(null);

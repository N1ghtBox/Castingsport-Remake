import { invoke } from "@tauri-apps/api/core";
import { type ReactNode, useEffect, useState } from "react";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import { LicenseContext } from "./LicenseContext";
import type { LicenseInfo, LicenseStatus } from "./types";

export function LicenseProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<LicenseStatus>("checking");
    const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);

    useEffect(() => {
        invoke<LicenseInfo>("validate_stored_license")
            .then((info) => {
                LoggingProvider.LogData("License validated", info);
                setLicenseInfo(info);
                setStatus("valid");
            })
            .catch(() => {
                setStatus("invalid");
            });
    }, []);

    async function activate(jwt: string): Promise<void> {
        const info = await invoke<LicenseInfo>("store_license", { jwt });
        setLicenseInfo(info);
        setStatus("valid");
    }

    async function deactivate(): Promise<void> {
        await invoke("clear_license");
        setLicenseInfo(null);
        setStatus("invalid");
    }

    return (
        <LicenseContext.Provider
            value={{ status, licenseInfo, activate, deactivate }}>
            {children}
        </LicenseContext.Provider>
    );
}

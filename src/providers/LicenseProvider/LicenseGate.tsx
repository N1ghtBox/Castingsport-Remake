import type { ReactNode } from "react";
import LicenseActivationPage from "@/pages/LicenseActivation/LicenseActivationPage";
import { useLicenseContext } from "./LicenseContext";

export function LicenseGate({ children }: { children: ReactNode }) {
    const ctx = useLicenseContext();

    if (ctx.status === "checking") {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
            </div>
        );
    }

    if (ctx.status === "invalid") {
        return <LicenseActivationPage />;
    }

    return <>{children}</>;
}

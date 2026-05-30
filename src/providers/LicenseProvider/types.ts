export interface LicenseInfo {
    licensee: string;
    expires_at: number | null;
    features: string[];
}

export type LicenseStatus = "checking" | "valid" | "invalid";

export interface LicenseContextProps {
    status: LicenseStatus;
    licenseInfo: LicenseInfo | null;
    activate: (jwt: string) => Promise<void>;
    deactivate: () => Promise<void>;
}

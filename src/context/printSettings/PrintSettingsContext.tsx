import React, { useState } from "react";

type PrintSettingsContextType = {
    showCreatorFooter: boolean;
    setShowCreatorFooter: (v: boolean) => void;
};

export const PrintSettingsContext = React.createContext<PrintSettingsContextType>({
    showCreatorFooter: true,
    setShowCreatorFooter: () => {},
});

export function usePrintSettings() {
    return React.useContext(PrintSettingsContext);
}

export function PrintSettingsProvider({ children }: { children: React.ReactNode }) {
    const [showCreatorFooter, setShowCreatorFooter] = useState(true);

    return (
        <PrintSettingsContext.Provider value={{ showCreatorFooter, setShowCreatorFooter }}>
            {children}
        </PrintSettingsContext.Provider>
    );
}

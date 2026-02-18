import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import ProgramConsts from "@/consts/Consts";
import { BaseContext } from "@/context/base/BaseContext";
import type { BaseContextProps } from "@/context/base/BaseContext.types";

type BaseLayoutProps = {
    children: JSX.Element;
};

export default function BaseLayout({ children }: BaseLayoutProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [debugMode, setDebugMode] = useState<boolean>(false);

    useEffect(() => {
        const unlistenPromise = listen(ProgramConsts.DebugModeEvent, () => {
            setDebugMode((prev) => !prev);
        });



        return () => {
            unlistenPromise.then((unlisten) => unlisten());
        };
    }, []);

    return (
        <BaseContext.Provider
            value={
                {
                    setLoading,
                    loading,
                    debugMode,
                } as BaseContextProps
            }>
            {loading && (
                <div className="z-50 inset-0 flex items-center justify-center .bg-background backdrop-blur-xs h-screen absolute top-0 left-0 w-screen">
                    <div className="flex flex-col items-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
                    </div>
                </div>
            )}
            {children}
        </BaseContext.Provider>
    );
}

import { invoke } from "@tauri-apps/api/core";
import { useContext, useEffect, useState } from "react";
import { LicenseContext } from "@/providers/LicenseProvider/LicenseContext";

export default function LicenseActivationPage() {
    const [machineId, setMachineId] = useState<string | null>(null);
    const [jwt, setJwt] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { activate } = useContext(LicenseContext)!;

    useEffect(() => {
        invoke<string>("get_machine_id").then(setMachineId).catch(() => setMachineId("błąd odczytu"));
    }, []);

    async function copyMachineId() {
        if (!machineId) return;
        await navigator.clipboard.writeText(machineId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleActivate() {
        setLoading(true);
        setError(null);
        try {
            await activate(jwt.trim());
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Nieznany błąd aktywacji";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[rgba(37,37,37,1)]">
            <div className="flex w-md flex-col gap-5 rounded-xl border border-gray-700 bg-[rgba(30,30,30,1)] p-8 shadow-xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Castingsport</h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Aktywacja licencji
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        ID urządzenia
                    </span>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 break-all">
                            {machineId ?? "Ładowanie..."}
                        </code>
                        <button
                            type="button"
                            onClick={copyMachineId}
                            disabled={!machineId}
                            className="shrink-0 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 disabled:opacity-40 transition-colors"
                        >
                            {copied ? "Skopiowano!" : "Kopiuj"}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Prześlij ID do wydawcy licencji, aby otrzymać klucz.
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Klucz licencji
                    </span>
                    <textarea
                        className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#6034ff] disabled:opacity-50 resize-none font-mono"
                        rows={4}
                        placeholder="Wklej tutaj otrzymany klucz licencji..."
                        value={jwt}
                        onChange={(e) => setJwt(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    className="rounded-md bg-[#6034ff] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4f28e0] disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleActivate}
                    disabled={loading || !jwt.trim()}
                    type="button"
                >
                    {loading ? "Aktywuję..." : "Aktywuj"}
                </button>
            </div>
        </div>
    );
}

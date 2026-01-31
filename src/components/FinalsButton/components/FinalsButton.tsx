import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { TypeOfContest } from "@/utils/contestUtils";
import { Button } from "../../ui/button";
import type { ButtonsProps } from "../types/FinalsButton.types";
import type { FormData } from "../types/FinalsForm.types";
import FinalsForm from "./FinalsForm";

export default function FinalsButton({ id, results }: ButtonsProps) {
    const contestId = useLoaderData() as number;

    const hasSaveResults = useMemo(() => {
        return !!window.localStorage.getItem(`finals-${id}-results`);
    }, [id]);

    const loadSavedResults = () => {
        const json = window.localStorage.getItem(`finals-${id}-results`);
        if (!json) return;
        const results = JSON.parse(json) as FormData;
        console.log(results);
    };

    if (TypeOfContest(contestId) !== "time") return;

    return (
        <div className="flex gap-5">
            <FinalsForm
                callback={(count, data) => {
                    // setFinalCount(count);
                    // setFinalResults(data);
                }}
                id={id}
                results={results}
            />
            <Button
                disabled={!hasSaveResults}
                onClick={loadSavedResults}>
                Zapisane finały
            </Button>
        </div>
    );
}

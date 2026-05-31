import { useContestContext } from "@/context/contest/ContestContext";
import { TypeOfContest } from "@/utils/contestUtils";
import type { ButtonsProps } from "../types/FinalsButton.types";
import FinalsForm from "./FinalsForm";

export default function FinalsButton({ id, results, callback }: ButtonsProps) {
    const { contestId } = useContestContext()

    if (TypeOfContest(contestId) !== "time") return;

    return (
        <div className="flex gap-5">
            <FinalsForm
                callback={callback}
                id={id}
                results={results}
            />
        </div>
    );
}

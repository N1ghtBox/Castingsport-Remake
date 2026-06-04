import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useContestContext } from "@/context/contest/ContestContext";
import type { ButtonsProps } from "../types/FinalsButton.types";
import FinalsForm from "./FinalsForm";

export default function FinalsButton({ id, results, callback }: ButtonsProps) {
    const { category } = useContestContext()

    return (
        <div className="flex gap-5">
            <Tooltip>
                <TooltipTrigger>
                    <span>
                        <FinalsForm
                            callback={callback}
                            id={id}
                            results={results}
                            disabled={!category}
                        />
                    </span>
                </TooltipTrigger>
                {!category && (
                    <TooltipContent>
                        Aby wygenerować finały, należy wybrać kategorie
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}

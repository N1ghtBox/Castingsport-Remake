import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useContestContext } from "@/context/contest/ContestContext";
import type { ButtonsProps } from "../types/FinalsButton.types";
import FinalsForm from "./FinalsForm";

export default function FinalsButton({ id, results, callback }: ButtonsProps) {
    const { category } = useContestContext()
    const { t } = useTranslation();

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
                        {t("finals.selectCategory")}
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}

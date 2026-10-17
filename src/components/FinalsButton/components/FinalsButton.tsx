import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useContestContext } from "@/context/contest/ContestContext";
import { useSectionLock } from "@/hooks/useSectionLock";
import type { ButtonsProps } from "../types/FinalsButton.types";
import FinalsForm from "./FinalsForm";

export default function FinalsButton({ id, results, callback }: ButtonsProps) {
    const { category } = useContestContext()
    const { t } = useTranslation();
    const lockReason = useSectionLock("finals");
    const disabledReason = lockReason ?? (!category ? t("finals.selectCategory") : undefined);

    return (
        <div className="flex gap-5">
            <Tooltip>
                <TooltipTrigger>
                    <span>
                        <FinalsForm
                            callback={callback}
                            id={id}
                            results={results}
                            disabled={!!disabledReason}
                        />
                    </span>
                </TooltipTrigger>
                {disabledReason && (
                    <TooltipContent>
                        {disabledReason}
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}

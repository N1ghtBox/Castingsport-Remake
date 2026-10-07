import { useTranslation } from "react-i18next";
import { type CompetitionSection, canEditSection } from "@/consts/CompetitionPermissions";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { getCompetitionStatus } from "@/types/Competition";

/** Returns why `section` can't be edited in the current competition status, or undefined when it can. */
export function useSectionLock(section: CompetitionSection): string | undefined {
	const { compInfo } = useCompetitionContext();
	const { t } = useTranslation();

	const status = getCompetitionStatus(compInfo);
	return canEditSection(status, section) ? undefined : t(`locked.${status}`);
}

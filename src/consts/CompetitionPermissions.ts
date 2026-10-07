import { CompetitionStatus } from "@/types/Competition";

export type CompetitionSection = "contestants" | "teams" | "schedule" | "results" | "finals";

// Which parts of a competition can be edited in each status.
const editableSections: Record<CompetitionStatus, CompetitionSection[]> = {
	[CompetitionStatus.NotStarted]: ["contestants", "teams", "schedule"],
	[CompetitionStatus.InProgress]: ["contestants", "teams", "schedule", "results", "finals"],
	[CompetitionStatus.Closed]: [],
	[CompetitionStatus.Cancelled]: [],
};

export const canEditSection = (status: CompetitionStatus, section: CompetitionSection) =>
	editableSections[status].includes(section);

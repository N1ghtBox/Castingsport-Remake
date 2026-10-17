import moment from "moment";
import { useCallback } from "react";
import { toast } from "sonner";
import { FirestoreProvider } from "@/providers/FirestoreProvider/FirestoreProvider";
import { type Competition, CompetitionStatus, getCompetitionStatus } from "@/types/Competition";
import type { Contestant } from "@/types/Contestant";
import type { Team } from "@/types/Teams";
import { sanitizeName } from "@/utils/inputUtils";
import { updateCompInfo } from "@/utils/jsonUtils";
import { generateCompetitionSyncDocs } from "@/utils/syncUtils";

type UseSyncCompetitionProps = {
	rows: Contestant[];
	teams: Team[];
	competition: Competition;
	competitionId: string;
	onSynced: (lastSynced: string) => void;
};

export function useSyncCompetition({
	rows,
	teams,
	competition,
	competitionId,
	onSynced,
}: UseSyncCompetitionProps) {
	const sync = useCallback(async () => {
		if (getCompetitionStatus(competition) !== CompetitionStatus.InProgress) return;

		const docs = generateCompetitionSyncDocs(rows, teams, competition.subcategories, {
			name: sanitizeName(competition.name),
			date: `${moment(competition?.dateFrom).format("D")}-${moment(competition?.dateTo).format("LL")}`,
			competitionId,
			isInternational: competition.isInternational,
		});

		try {
			await Promise.all(
				docs.map((doc) => FirestoreProvider.syncCompetitionData(doc.id, doc.data)),
			);
			const lastSynced = moment().format("yyyy-MM-DD HH:mm:ss");
			onSynced(lastSynced);
			updateCompInfo(competitionId, { ...competition, lastSynced });
		} catch {
			toast.error("Sync failed. Check your connection.");
		}
	}, [rows, teams, competition, competitionId, onSynced]);

	const askToSync = useCallback(() => {
		toast("Sync to cloud?", {
			action: { label: "Sync", onClick: sync },
			cancel: { label: "Cancel", onClick: () => { } },
		});
	}, [sync]);

	return { sync, askToSync };
}

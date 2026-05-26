import moment from "moment";
import { useCallback } from "react";
import { toast } from "sonner";
import { FirestoreProvider } from "@/providers/FirestoreProvider/FirestoreProvider";
import type { Competition } from "@/types/Competition";
import type { Contestant } from "@/types/Contestant";
import { updateCompInfo } from "@/utils/jsonUtils";
import { generateSyncData } from "@/utils/syncUtils";

type UseSyncCompetitionProps = {
	rows: Contestant[];
	competition: Competition;
	competitionId: string;
	onSynced: (lastSynced: string) => void;
};

export function useSyncCompetition({
	rows,
	competition,
	competitionId,
	onSynced,
}: UseSyncCompetitionProps) {
	const sync = useCallback(async () => {
		const syncData = generateSyncData(
			rows,
			competition.name,
			`${moment(competition?.dateFrom).format("DD")}-${moment(competition?.dateTo).format("LL")}`,
		);

		const lastSynced = moment().format("yyyy-MM-DD HH:mm:ss");

		onSynced(lastSynced);
		updateCompInfo(competitionId, { ...competition, lastSynced });
		FirestoreProvider.syncCompetitionData(competitionId, syncData);
	}, [rows, competition, competitionId, onSynced]);

	const askToSync = useCallback(() => {
		toast("Sync to cloud?", {
			action: { label: "Sync", onClick: sync },
			cancel: { label: "Cancel", onClick: () => {} },
		});
	}, [sync]);

	return { sync, askToSync };
}

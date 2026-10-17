import { getAuth, signInAnonymously } from "firebase/auth";
import { doc, type Firestore, initializeFirestore, persistentLocalCache, setDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import type { Competition } from "@/types/Competition";
import type { Series } from "@/types/Series";
import type { SyncData, SyncSerieData } from "@/types/SyncData";
import { LoggingProvider } from "../LoggingProvider/LoggingProvider";

class Provider {
    private readonly firestore: Firestore;
    private readonly CompetitionDocName = "Competitions";
    private readonly SeriesDocName = "Series";

    constructor() {
        const auth = getAuth(firebaseApp);
        signInAnonymously(auth)
            .then(() => LoggingProvider.LogInfo("Firebase signed in anonymously"))
            .catch((err) => LoggingProvider.LogException("Firebase anonymous sign-in failed", err));
        this.firestore = initializeFirestore(firebaseApp, {
            localCache: persistentLocalCache(),
        });
    }

    async syncCompetitionData(id: Competition["id"], data: SyncData) {
        LoggingProvider.LogInfo("Synchronizing data to firestore.");
        await setDoc(doc(this.firestore, this.CompetitionDocName, id), data);
    }

    async syncSerieData(id: Series["id"], data: SyncSerieData) {
        LoggingProvider.LogInfo(`Synchronizing series ${id} to firestore.`);
        await setDoc(doc(this.firestore, this.SeriesDocName, id), data);
    }
}

export const FirestoreProvider = new Provider();

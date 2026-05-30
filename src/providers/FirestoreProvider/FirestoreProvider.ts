import { firebaseApp } from "@/lib/firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import { doc, type Firestore, initializeFirestore, persistentLocalCache, setDoc } from "firebase/firestore";
import type { Competition } from "@/types/Competition";
import type { SyncData } from "@/types/SyncData";
import { LoggingProvider } from "../LoggingProvider/LoggingProvider";

class Provider {
    private readonly firestore: Firestore;
    private readonly CompetitionDocName = "Competitions";

    constructor() {
        const auth = getAuth(firebaseApp);
        signInAnonymously(auth)
            .then(() => console.log("Signed in"))
            .catch((err) => console.error(err));
        this.firestore = initializeFirestore(firebaseApp, {
            localCache: persistentLocalCache(),
        });
    }

    async syncCompetitionData(id: Competition["id"], data: SyncData) {
        LoggingProvider.LogInfo("Synchronizing data to firestore.");
        await setDoc(doc(this.firestore, this.CompetitionDocName, id), data);
    }
}

export const FirestoreProvider = new Provider();

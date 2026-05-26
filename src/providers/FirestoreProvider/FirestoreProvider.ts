// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { doc, type Firestore, getFirestore, setDoc } from "firebase/firestore";
import type { Competition } from "@/types/Competition";
import type { SyncData } from "@/types/SyncData";
import { LoggingProvider } from "../LoggingProvider/LoggingProvider";

const firebaseConfig = {
    apiKey: "AIzaSyCg7PMVvxWia1WjhzAGgchZfJ-W2UhXZc4",
    authDomain: "castingsport-f9228.firebaseapp.com",
    projectId: "castingsport-f9228",
    storageBucket: "castingsport-f9228.appspot.com",
    messagingSenderId: "856568689966",
    appId: "1:856568689966:web:beb0d2e5b529acdede36bf",
    measurementId: "G-BENT3FF4R4",
};

class Provider {
    private readonly firestore: Firestore;
    private readonly CompetitionDocName = "Competitions";

    constructor() {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        signInAnonymously(auth)
            .then(() => console.log("Signed in"))
            .catch((err) => console.error(err));
        this.firestore = getFirestore(app);
    }

    async syncCompetitionData(id: Competition["id"], data: SyncData) {
        LoggingProvider.LogInfo("Synchronizing data to firestore.");
        await setDoc(doc(this.firestore, this.CompetitionDocName, id), data);
    }
}

export const FirestoreProvider = new Provider();

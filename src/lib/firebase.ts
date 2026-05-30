import { getApps, initializeApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCg7PMVvxWia1WjhzAGgchZfJ-W2UhXZc4",
    authDomain: "castingsport-f9228.firebaseapp.com",
    projectId: "castingsport-f9228",
    storageBucket: "castingsport-f9228.appspot.com",
    messagingSenderId: "856568689966",
    appId: "1:856568689966:web:beb0d2e5b529acdede36bf",
    measurementId: "G-BENT3FF4R4",
};

export const firebaseApp: FirebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

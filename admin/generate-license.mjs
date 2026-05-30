#!/usr/bin/env node
// Generate a signed Ed25519 license JWT for a specific machine.
//
// Setup (one time):
//   cd admin
//   npm install jose
//
// Generate keypair (one time):
//   openssl genpkey -algorithm ed25519 -out private.pem
//   openssl pkey -in private.pem -pubout -out public.pem
//   -> paste public.pem contents into LICENSE_PUBLIC_KEY in src-tauri/src/license.rs
//
// Usage:
//   node generate-license.mjs --machine-id <id> --name "Club XYZ" [--expires 2027-01-01]

import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { SignJWT, importPKCS8 } from "jose";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { values } = parseArgs({
    options: {
        "machine-id": { type: "string" },
        name: { type: "string" },
        expires: { type: "string" },
        features: { type: "string", default: "" },
    },
    strict: true,
});

const machineId = values["machine-id"];
const name = values["name"];
const expiresArg = values["expires"];
const features = values["features"] ? values["features"].split(",").map((f) => f.trim()) : [];

if (!machineId || !name) {
    console.error("Usage: node generate-license.mjs --machine-id <id> --name <licensee> [--expires YYYY-MM-DD] [--features feat1,feat2]");
    process.exit(1);
}

const privateKeyPem = readFileSync(join(__dirname, "private.pem"), "utf8");
const privateKey = await importPKCS8(privateKeyPem, "EdDSA");

const payload = {
    machine_id: machineId,
    features,
};

const builder = new SignJWT(payload)
    .setProtectedHeader({ alg: "EdDSA" })
    .setSubject(name)
    .setIssuedAt();

if (expiresArg) {
    const expDate = new Date(expiresArg);
    if (Number.isNaN(expDate.getTime())) {
        console.error(`Invalid date: ${expiresArg}. Use YYYY-MM-DD format.`);
        process.exit(1);
    }
    builder.setExpirationTime(expDate);
}

const jwt = await builder.sign(privateKey);

console.log("\n--- LICENSE JWT ---");
console.log(jwt);
console.log("-------------------\n");

const info = {
    licensee: name,
    machineId,
    expires: expiresArg ?? "perpetual",
    features: features.length ? features : "none",
};
console.log("License info:", info);

// Generates an Ed25519 keypair using Node.js built-in crypto (no OpenSSL needed).
// Run once: node admin/generate-keypair.mjs
// Then paste the printed public key into LICENSE_PUBLIC_KEY in src-tauri/src/license.rs

import { generateKeyPairSync } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
});

writeFileSync(join(__dirname, "private.pem"), privateKey);
writeFileSync(join(__dirname, "public.pem"), publicKey);

console.log("Generated: admin/private.pem and admin/public.pem\n");
console.log("Paste this into LICENSE_PUBLIC_KEY in src-tauri/src/license.rs:");
console.log("=".repeat(60));
console.log(publicKey.trim());
console.log("=".repeat(60));
console.log("\nKeep private.pem secret — never commit it to git.");

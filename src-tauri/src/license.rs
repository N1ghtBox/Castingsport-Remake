use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use keyring::Entry;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use tauri::command;

const SERVICE_NAME: &str = "castingsport-license";
const ACCOUNT_NAME: &str = "license-jwt";

// TODO: Replace with your Ed25519 public key before shipping.
// Generate:
//   openssl genpkey -algorithm ed25519 -out private.pem
//   openssl pkey -in private.pem -pubout -out public.pem
// Then paste the contents of public.pem here.
// Upload private.pem to Firebase Secret Manager as LICENSE_PRIVATE_KEY.
const LICENSE_PUBLIC_KEY: &str = "-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAot1adRU9rB/ctZuc47Pk/cAMmuw8FMo7ifnEBSAWhDk=
-----END PUBLIC KEY-----";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LicenseInfo {
    pub licensee: String,
    pub expires_at: Option<u64>,
    pub features: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    machine_id: String,
    exp: Option<usize>,
    features: Option<Vec<String>>,
}

fn verify_jwt(jwt: &str) -> Result<LicenseInfo, String> {
    if LICENSE_PUBLIC_KEY.is_empty() {
        return Err("License validation not configured (no public key set)".to_string());
    }

    let machine_id = machine_uid::get().map_err(|e| format!("Cannot read machine ID: {e}"))?;

    let decoding_key = DecodingKey::from_ed_pem(LICENSE_PUBLIC_KEY.as_bytes())
        .map_err(|e| format!("Invalid public key configuration: {e}"))?;

    let mut validation = Validation::new(Algorithm::EdDSA);
    validation.validate_exp = false;
    validation.required_spec_claims = HashSet::new();

    let token_data = decode::<Claims>(jwt, &decoding_key, &validation)
        .map_err(|e| format!("Invalid license: {e}"))?;

    let claims = token_data.claims;

    if claims.machine_id != machine_id {
        return Err("License is bound to a different machine".to_string());
    }

    if let Some(exp) = claims.exp {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as usize;
        if exp < now {
            return Err("License has expired".to_string());
        }
    }

    Ok(LicenseInfo {
        licensee: claims.sub,
        expires_at: claims.exp.map(|e| e as u64),
        features: claims.features.unwrap_or_default(),
    })
}

#[command]
pub fn get_machine_id() -> Result<String, String> {
    machine_uid::get().map_err(|e| e.to_string())
}

#[command]
pub fn validate_stored_license() -> Result<LicenseInfo, String> {
    let entry = Entry::new(SERVICE_NAME, ACCOUNT_NAME).map_err(|e| e.to_string())?;
    let jwt = entry
        .get_password()
        .map_err(|_| "No license stored".to_string())?;
    verify_jwt(&jwt)
}

#[command]
pub fn store_license(jwt: String) -> Result<LicenseInfo, String> {
    let info = verify_jwt(&jwt)?;
    let entry = Entry::new(SERVICE_NAME, ACCOUNT_NAME).map_err(|e| e.to_string())?;
    entry.set_password(&jwt).map_err(|e| e.to_string())?;
    Ok(info)
}

#[command]
pub fn clear_license() -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, ACCOUNT_NAME).map_err(|e| e.to_string())?;
    entry.delete_credential().map_err(|e| e.to_string())
}

use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::PathBuf;
use tauri::{command, AppHandle, Manager};

const LICENSE_FILE: &str = "license.jwt";

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

fn license_path(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map(|d| d.join(LICENSE_FILE))
        .map_err(|e| format!("Cannot resolve app data dir: {e}"))
}

fn verify_jwt(jwt: &str) -> Result<LicenseInfo, String> {
    let machine_id = machine_uid::get().map_err(|e| format!("Cannot read machine ID: {e}"))?;

    let decoding_key = DecodingKey::from_ed_pem(LICENSE_PUBLIC_KEY.as_bytes())
        .map_err(|e| format!("Invalid public key: {e}"))?;

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
pub fn validate_stored_license(app: AppHandle) -> Result<LicenseInfo, String> {
    let path = license_path(&app)?;
    let jwt = std::fs::read_to_string(&path).map_err(|_| "No license stored".to_string())?;
    verify_jwt(jwt.trim())
}

#[command]
pub fn store_license(app: AppHandle, jwt: String) -> Result<LicenseInfo, String> {
    let info = verify_jwt(jwt.trim())?;
    let path = license_path(&app)?;
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir).map_err(|e| format!("Cannot create app data dir: {e}"))?;
    }
    std::fs::write(&path, jwt.trim()).map_err(|e| format!("Cannot save license: {e}"))?;
    log::info!("License stored for: {}", info.licensee);
    Ok(info)
}

#[command]
pub fn clear_license(app: AppHandle) -> Result<(), String> {
    let path = license_path(&app)?;
    std::fs::remove_file(&path).map_err(|e| e.to_string())
}

use serde_json::json;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            init_app_data_file(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub fn init_app_data_file(app: &AppHandle) {
    let file_name = "data.json";

    // Build the path to the file inside the App directory
    let path_result: tauri::Result<PathBuf> = app.path().app_data_dir().map(|mut path| {
        path.push(file_name);
        path
    });

    if let Ok(path) = path_result {
        // Check if file exists
        if !path.exists() {
            // Default JSON content
            let default_content = json!({
                "competitions": [],
                "series": [],
            })
            .to_string();

            // Ensure parent directory exists
            if let Some(parent_dir) = path.parent() {
                std::fs::create_dir_all(parent_dir).unwrap_or_else(|e| {
                    println!("Failed to create parent dir: {}", e);
                });
            }

            // Write file
            if let Err(e) = std::fs::write(&path, default_content) {
                println!("Failed to write file: {}", e);
            } else {
                println!("Default data.json created at: {:?}", path);
            }
        } else {
            println!("data.json already exists at: {:?}", path);
        }
    } else {
        println!("Could not resolve app data path.");
    }
}

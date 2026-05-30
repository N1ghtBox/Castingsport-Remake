mod license;
use license::{clear_license, get_machine_id, store_license, validate_stored_license};

use chrono::Local;
use serde_json::json;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tauri_plugin_updater::UpdaterExt;

use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;
use tauri::command;

/// Reads the last `n` lines from a file
fn tail_lines<P: AsRef<Path>>(filename: P, n: usize) -> io::Result<Vec<String>> {
    let file = File::open(filename)?;
    let lines: Vec<String> = io::BufReader::new(file)
        .lines()
        .filter_map(Result::ok)
        .collect();

    let total_lines = lines.len();
    let start = if total_lines > n { total_lines - n } else { 0 };
    Ok(lines[start..].to_vec())
}

#[command]
fn get_latest_logs(app: AppHandle) -> Result<Vec<String>, String> {
    let log_dir = app.path().app_log_dir().unwrap();

    // `file_name: Some("logs".to_string())` => default file is "logs.log"
    let log_file = log_dir.join("logs.log");
    tail_lines(log_file, 100).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "[{} {}] {}",
                        record.level(),
                        Local::now().format("%Y-%m-%d %H:%M:%S"),
                        message
                    ))
                })
                .level(log::LevelFilter::Info)
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("logs".to_string()),
                    },
                ))
                .build(),
        )
        .setup(|app| {
            #[cfg(desktop)]
            {
                use tauri::Emitter;
                use tauri_plugin_global_shortcut::ShortcutState;

                            init_app_data_file(app.handle());

            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                update(handle).await.unwrap();
            });

                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_shortcut("ctrl+shift+d")?
                        .with_handler(|app, _shortcut, event| {
                            if event.state == ShortcutState::Pressed {
                                log::warn!("Debug mode toggled");
                                let _ = app.emit("toggle-debug-mode", ());
                            }
                        })
                        .build(),
                )?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_latest_logs,
            get_machine_id,
            validate_stored_license,
            store_license,
            clear_license
        ])
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

async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
    println!("Checking for update");
    log::info!("Checking for update");
    if let Some(update) = app.updater()?.check().await? {
        let mut downloaded = 0;

        // alternatively we could also call update.download() and update.install() separately
        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    println!("downloaded {downloaded} from {content_length:?}");
                },
                || {
                    println!("download finished");
                },
            )
            .await?;

        println!("update installed");
        app.restart();
    } else {
        println!("No new update");
        log::info!("No new update");
    }
    Ok(())
}

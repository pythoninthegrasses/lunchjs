pub mod db;

use db::{Database, Restaurant};
use std::sync::OnceLock;

static DB: OnceLock<Database> = OnceLock::new();

fn get_db() -> &'static Database {
    DB.get_or_init(|| Database::new().expect("Failed to initialize database"))
}

#[tauri::command]
fn list_restaurants() -> Result<Vec<Restaurant>, String> {
    get_db().list_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn add_restaurant(name: String, category: String) -> Result<(), String> {
    get_db().add(&name, &category).map_err(|e| {
        if e.to_string().contains("UNIQUE constraint") {
            format!("Restaurant '{}' already exists", name)
        } else {
            e.to_string()
        }
    })
}

#[tauri::command]
fn delete_restaurant(name: String) -> Result<(), String> {
    get_db().delete(&name).map_err(|e| e.to_string())
}

#[tauri::command]
fn roll_lunch(category: String) -> Result<Restaurant, String> {
    get_db().roll(&category).map_err(|e| {
        if e.to_string().contains("no rows") {
            "No restaurants found!".to_string()
        } else {
            e.to_string()
        }
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            list_restaurants,
            add_restaurant,
            delete_restaurant,
            roll_lunch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

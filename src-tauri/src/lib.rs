pub mod db;

use db::{Database, Restaurant};
use std::sync::OnceLock;
use tauri::Manager;

static DB: OnceLock<Database> = OnceLock::new();

fn get_db() -> &'static Database {
    DB.get().expect("Database not initialized")
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
fn update_restaurant(original_name: String, new_name: String, new_category: String) -> Result<(), String> {
    get_db().update(&original_name, &new_name, &new_category).map_err(|e| {
        if e.to_string().contains("already exists") {
            format!("Restaurant '{}' already exists", new_name)
        } else {
            e.to_string()
        }
    })
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
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(feature = "devtools")]
    {
        builder = builder.plugin(tauri_plugin_devtools::init());
    }

    builder
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            let db_path = app_data_dir.join("lunch.db");

            tracing::info!("Initializing database at: {:?}", db_path);

            let database = Database::new_with_path(db_path)
                .expect("Failed to initialize database");
            DB.set(database).expect("Database already initialized");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_restaurants,
            add_restaurant,
            delete_restaurant,
            update_restaurant,
            roll_lunch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

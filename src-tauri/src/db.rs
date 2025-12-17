use chrono::Utc;
use rand::prelude::IndexedRandom;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Restaurant {
    pub name: String,
    pub category: String,
}

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new() -> Result<Self> {
        let path = get_db_path();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).ok();
        }
        let conn = Connection::open(&path)?;
        Self::with_connection(conn)
    }

    pub fn with_connection(conn: Connection) -> Result<Self> {
        let db = Database {
            conn: Mutex::new(conn),
        };
        db.init_tables()?;
        Ok(db)
    }

    pub fn in_memory() -> Result<Self> {
        let conn = Connection::open_in_memory()?;
        Self::with_connection(conn)
    }

    fn init_tables(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS lunch_list (
                restaurants TEXT PRIMARY KEY,
                option TEXT
            );
            CREATE TABLE IF NOT EXISTS recent_lunch (
                restaurants TEXT PRIMARY KEY,
                date TEXT
            );
        "#,
        )?;
        Ok(())
    }

    pub fn list_all(&self) -> Result<Vec<Restaurant>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT restaurants, option FROM lunch_list ORDER BY restaurants")?;
        let rows = stmt.query_map([], |row| {
            Ok(Restaurant {
                name: row.get(0)?,
                category: row.get(1)?,
            })
        })?;
        rows.collect()
    }

    pub fn list_by_category(&self, category: &str) -> Result<Vec<Restaurant>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare("SELECT restaurants, option FROM lunch_list WHERE LOWER(option) = LOWER(?)")?;
        let rows = stmt.query_map([category], |row| {
            Ok(Restaurant {
                name: row.get(0)?,
                category: row.get(1)?,
            })
        })?;
        rows.collect()
    }

    pub fn add(&self, name: &str, category: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO lunch_list (restaurants, option) VALUES (?, ?)",
            [name, category],
        )?;
        Ok(())
    }

    pub fn delete(&self, name: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM lunch_list WHERE restaurants = ?", [name])?;
        Ok(())
    }

    pub fn roll(&self, category: &str) -> Result<Restaurant> {
        let restaurants = self.list_by_category(category)?;
        if restaurants.is_empty() {
            return Err(rusqlite::Error::QueryReturnedNoRows);
        }

        // Get last selected to avoid immediate repeat
        let conn = self.conn.lock().unwrap();
        let last: Option<String> = conn
            .query_row(
                "SELECT restaurants FROM recent_lunch ORDER BY date DESC LIMIT 1",
                [],
                |row| row.get(0),
            )
            .ok();

        // Filter out last selection if possible
        let available: Vec<_> = restaurants
            .iter()
            .filter(|r| Some(&r.name) != last.as_ref())
            .cloned()
            .collect();

        let chosen = if available.is_empty() {
            restaurants.choose(&mut rand::rng()).unwrap()
        } else {
            available.choose(&mut rand::rng()).unwrap()
        };

        // Record selection
        conn.execute(
            "INSERT OR REPLACE INTO recent_lunch (restaurants, date) VALUES (?, ?)",
            [&chosen.name, &Utc::now().to_rfc3339()],
        )?;

        // Keep only last 14 entries
        conn.execute(
            "DELETE FROM recent_lunch WHERE restaurants NOT IN (
                SELECT restaurants FROM recent_lunch ORDER BY date DESC LIMIT 14
            )",
            [],
        )?;

        Ok(chosen.clone())
    }
}

fn get_db_path() -> PathBuf {
    #[cfg(target_os = "macos")]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("Lunch")
            .join("lunch.db")
    }
    #[cfg(target_os = "ios")]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("lunch.db")
    }
    #[cfg(not(any(target_os = "macos", target_os = "ios")))]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("lunch")
            .join("lunch.db")
    }
}

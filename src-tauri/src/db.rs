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
        Self::with_connection_internal(conn, true)
    }

    fn with_connection_internal(conn: Connection, should_seed: bool) -> Result<Self> {
        let db = Database {
            conn: Mutex::new(conn),
        };
        db.init_tables()?;
        if should_seed {
            db.seed_database()?;
        }
        Ok(db)
    }

    pub fn in_memory() -> Result<Self> {
        let conn = Connection::open_in_memory()?;
        Self::with_connection_internal(conn, false)
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

    fn seed_database(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        // Check if database is empty (first launch)
        let count: i64 = conn.query_row(
            "SELECT COUNT(*) FROM lunch_list",
            [],
            |row| row.get(0),
        )?;

        if count > 0 {
            // Database already has data, skip seeding
            return Ok(());
        }

        // Parse embedded CSV and seed database
        let csv_data = include_str!("../lunch_list.csv");
        let mut reader = csv::Reader::from_reader(csv_data.as_bytes());

        for result in reader.records() {
            let record = result.map_err(|e| {
                rusqlite::Error::FromSqlConversionFailure(
                    0,
                    rusqlite::types::Type::Text,
                    Box::new(e),
                )
            })?;

            if record.len() >= 2 {
                let name = record.get(0).unwrap_or("");
                let category = record.get(1).unwrap_or("");

                if !name.is_empty() && !category.is_empty() {
                    conn.execute(
                        "INSERT INTO lunch_list (restaurants, option) VALUES (?, ?)",
                        [name, category],
                    )?;
                }
            }
        }

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
    #[cfg(target_os = "android")]
    {
        // On Android, use the app's internal storage directory
        // Falls back to current dir if dirs::data_local_dir fails
        dirs::data_local_dir()
            .unwrap_or_else(|| PathBuf::from("/data/local/tmp"))
            .join("lunch.db")
    }
    #[cfg(not(any(target_os = "macos", target_os = "ios", target_os = "android")))]
    {
        dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("lunch")
            .join("lunch.db")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_seed_database_on_first_launch() {
        let db = Database::in_memory().unwrap();

        // Explicitly seed the database
        db.seed_database().unwrap();

        // Verify restaurants were seeded
        let restaurants = db.list_all().unwrap();
        assert!(restaurants.len() > 0, "Database should be seeded with restaurants");

        // Verify both cheap and normal categories exist
        let cheap = db.list_by_category("cheap").unwrap();
        let normal = db.list_by_category("normal").unwrap();
        assert!(cheap.len() > 0, "Should have cheap restaurants");
        assert!(normal.len() > 0, "Should have normal restaurants");

        // Verify specific restaurants from CSV
        assert!(
            restaurants.iter().any(|r| r.name == "Arbys"),
            "Should contain Arbys from seed data"
        );
        assert!(
            restaurants.iter().any(|r| r.name == "Bubba's"),
            "Should contain Bubba's from seed data"
        );
    }

    #[test]
    fn test_seed_database_does_not_overwrite() {
        let db = Database::in_memory().unwrap();

        // Add a custom restaurant before seeding
        db.add("Custom Restaurant", "normal").unwrap();

        // Try seeding (should not add anything because database is not empty)
        db.seed_database().unwrap();

        // Verify count is only 1 (our custom restaurant)
        let final_restaurants = db.list_all().unwrap();
        assert_eq!(
            final_restaurants.len(),
            1,
            "Seeding should not run on non-empty database"
        );
        assert!(
            final_restaurants.iter().any(|r| r.name == "Custom Restaurant"),
            "Custom restaurant should be preserved"
        );
    }
}

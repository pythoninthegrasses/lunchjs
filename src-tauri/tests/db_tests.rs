use lunch::db::Database;

fn test_db() -> Database {
    Database::in_memory().expect("Failed to create in-memory database")
}

#[test]
fn test_database_initialization() {
    let db = test_db();
    let restaurants = db.list_all().unwrap();
    assert!(restaurants.is_empty());
}

#[test]
fn test_add_restaurant() {
    let db = test_db();
    db.add("Test Place", "cheap").unwrap();

    let restaurants = db.list_all().unwrap();
    assert_eq!(restaurants.len(), 1);
    assert_eq!(restaurants[0].name, "Test Place");
    assert_eq!(restaurants[0].category, "cheap");
}

#[test]
fn test_add_duplicate_restaurant() {
    let db = test_db();
    db.add("Duplicate", "cheap").unwrap();

    let result = db.add("Duplicate", "normal");
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("UNIQUE"));
}

#[test]
fn test_delete_restaurant() {
    let db = test_db();
    db.add("To Delete", "cheap").unwrap();
    assert_eq!(db.list_all().unwrap().len(), 1);

    db.delete("To Delete").unwrap();
    assert!(db.list_all().unwrap().is_empty());
}

#[test]
fn test_delete_nonexistent() {
    let db = test_db();
    let result = db.delete("Does Not Exist");
    assert!(result.is_ok());
}

#[test]
fn test_list_all_empty() {
    let db = test_db();
    let restaurants = db.list_all().unwrap();
    assert!(restaurants.is_empty());
}

#[test]
fn test_list_all_with_data() {
    let db = test_db();
    db.add("Place A", "cheap").unwrap();
    db.add("Place B", "normal").unwrap();
    db.add("Place C", "cheap").unwrap();

    let restaurants = db.list_all().unwrap();
    assert_eq!(restaurants.len(), 3);
}

#[test]
fn test_list_all_sorted_alphabetically() {
    let db = test_db();
    db.add("Zebra", "cheap").unwrap();
    db.add("Apple", "normal").unwrap();
    db.add("Mango", "cheap").unwrap();

    let restaurants = db.list_all().unwrap();
    assert_eq!(restaurants[0].name, "Apple");
    assert_eq!(restaurants[1].name, "Mango");
    assert_eq!(restaurants[2].name, "Zebra");
}

#[test]
fn test_list_by_category() {
    let db = test_db();
    db.add("Cheap Place 1", "cheap").unwrap();
    db.add("Cheap Place 2", "cheap").unwrap();
    db.add("Normal Place", "normal").unwrap();

    let cheap = db.list_by_category("cheap").unwrap();
    assert_eq!(cheap.len(), 2);

    let normal = db.list_by_category("normal").unwrap();
    assert_eq!(normal.len(), 1);
    assert_eq!(normal[0].name, "Normal Place");
}

#[test]
fn test_list_by_category_case_insensitive() {
    let db = test_db();
    db.add("Place", "Cheap").unwrap();

    let result = db.list_by_category("cheap").unwrap();
    assert_eq!(result.len(), 1);

    let result = db.list_by_category("CHEAP").unwrap();
    assert_eq!(result.len(), 1);
}

#[test]
fn test_roll_single_restaurant() {
    let db = test_db();
    db.add("Only Option", "cheap").unwrap();

    let result = db.roll("cheap").unwrap();
    assert_eq!(result.name, "Only Option");
}

#[test]
fn test_roll_empty_category() {
    let db = test_db();
    db.add("Cheap Place", "cheap").unwrap();

    let result = db.roll("normal");
    assert!(result.is_err());
}

#[test]
fn test_roll_excludes_recent() {
    let db = test_db();
    db.add("Place A", "cheap").unwrap();
    db.add("Place B", "cheap").unwrap();

    let first = db.roll("cheap").unwrap();
    let second = db.roll("cheap").unwrap();

    assert_ne!(first.name, second.name);
}

#[test]
fn test_roll_with_single_option_allows_repeat() {
    let db = test_db();
    db.add("Only One", "cheap").unwrap();

    let first = db.roll("cheap").unwrap();
    let second = db.roll("cheap").unwrap();

    assert_eq!(first.name, "Only One");
    assert_eq!(second.name, "Only One");
}

#[test]
fn test_full_crud_workflow() {
    let db = test_db();

    // Create
    db.add("New Restaurant", "normal").unwrap();

    // Read
    let list = db.list_all().unwrap();
    assert_eq!(list.len(), 1);
    assert_eq!(list[0].name, "New Restaurant");

    // Update (via delete + add since no update method)
    db.delete("New Restaurant").unwrap();
    db.add("Updated Restaurant", "cheap").unwrap();

    let list = db.list_all().unwrap();
    assert_eq!(list.len(), 1);
    assert_eq!(list[0].name, "Updated Restaurant");
    assert_eq!(list[0].category, "cheap");

    // Delete
    db.delete("Updated Restaurant").unwrap();
    assert!(db.list_all().unwrap().is_empty());
}

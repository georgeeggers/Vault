// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "intialize_database",
            sql: 
"CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    projectType TEXT NOT NULL,
    totalLength INTEGER,
    thumbnail BLOB,
    name TEXT
);
CREATE TABLE songContainer (
    id TEXT PRIMARY KEY,
    name TEXT,
    duration INTEGER,
    FOREIGN KEY (id) REFERENCES projects (id) ON DELETE CASCADE
);
CREATE TABLE songData (
    id TEXT PRIMARY KEY,
    content BLOB, 
    FOREIGN KEY (id) REFERENCES songContainer (id) ON DELETE CASCADE
);
CREATE TABLE songDataOptions (
    id TEXT PRIMARY KEY,
    lyrics TEXT,
    bpm INTEGER,
    FOREIGN KEY (id) REFERENCES songData (id) ON DELETE CASCADE
);",
            kind: MigrationKind::Up
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations("sqlite:data.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

import sqlite3 from "better-sqlite3";
import { migrations } from "./migrations";
import log from "electron-log/main";
log.initialize();

export const connectDatabase = (dbPath: string) => {
    log.info(`Connecting to database at ${dbPath}`);
    const db = new sqlite3(dbPath);

    db.pragma("foreign_keys = ON");
    db.exec("PRAGMA journal_mode=WAL");

    db.prepare(
        `CREATE TABLE IF NOT EXISTS "_migrations" (
            "id" TEXT NOT NULL PRIMARY KEY
        )`
    ).run();

    const appliedMigrations = db.prepare("SELECT id FROM _migrations").all() as { id: string }[];

    const appliedMigrationIds = appliedMigrations.map((m) => m.id);
    migrations.forEach(({ id, sql }) => {
        if (!appliedMigrationIds.includes(id)) {
            db.exec(sql);
            db.prepare("INSERT INTO _migrations (id) VALUES (?)").run(id);
            log.info(`Applied migration ${id}`);
        }
    });
    db.close();
    log.info("Database migration complete");
};

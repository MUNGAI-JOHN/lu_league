// src/drizzle/migrate.ts
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../config/db.ts"; // adjust this path to your database client instance

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
    console.log("Migrations complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigrations();

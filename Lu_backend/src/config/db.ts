// Load environment variables
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

// Import your schema (we’ll define later in drizzle/schema.ts)
import * as schema from "../drizzle/schema.ts";

// Create a PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL as string,
});

// Connect to the database
client.connect()
 .then(() => console.log("✅ Connected to PostgreSQL via Drizzle"))
.catch((err) => console.error("❌ Database connection error:", err));

// Export the drizzle instance
export const db = drizzle(client, { schema });

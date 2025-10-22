import { db } from "../config/db.ts"; // your Drizzle DB instance
import { users } from "./schema.ts";
import bcrypt from "bcryptjs";

const insertAdmin = async () => {
  try {
    // 1. Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10); // your desired password

    // 2. Insert admin into the users table
    const [admin] = await db
      .insert(users)
      .values({
        name: "SuperAdmin",
        email: "admin@example.com",
        password: hashedPassword, // store hashed password
        role: "admin",
        phone: "0700000000",
        status: "approved"
      })
      .returning();

    console.log("Admin created:", admin);
  } catch (err) {
    console.error("Error inserting admin:", err);
  }
};

insertAdmin();

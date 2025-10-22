// Get your imports
import "dotenv/config"
import {defineConfig} from "drizzle-kit"
//initialize out your =r definedConfig
export default defineConfig ({
    dialect:"postgresql",
    schema:"./src/drizzle/schema.ts",
    out:"./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
    verbose: true,
    strict: true
})
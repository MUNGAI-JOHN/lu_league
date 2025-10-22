import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import app from "./app.ts";
//import matchRouter from "./modules/matches/match.routes.ts"; // 👈 your router

dotenv.config();

const PORT = process.env.PORT || 5000;
/*const app: Application = express();*/

// 👇 Mount the matchRouter here
//app.use("/api/users", matchRouter);

app.listen(PORT, () => {
  console.log(`🚀Server running on http://localhost:${PORT}`);
});

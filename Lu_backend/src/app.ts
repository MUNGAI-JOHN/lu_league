import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes 
import adminroutes from "./modules/admin/admin.routes.ts"
// Import your coachRoutes
import coachRoutes from "./modules/coach/coach.routes.ts";
// Import your refereeRoutes
import refereeRoutes from "./modules/referees/referee.routes.ts";
// Import your teamRoutes
import teamRoutes from "./modules/teams/team.routes.ts";
// Import your playerRoutes
import playerRoutes from "./modules/players/player.routes.ts";
// Import your matchRoutes
import matchRoutes from "./modules/matches/match.routes.ts";
// Import your authRoutes
import authRoutes from "./modules/auth/auth.routes.ts";
/*import resetpasswordRoutes from "./modules/auth/resetpassword/resetpassword.routes.ts";*/
import testRoutes from "./modules/routes/test.routes.ts";

// Initialize environment variables Lu_backend\src\modules\teams\team.routes.ts
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to LU League Champions API ⚽");
});

// Register routes
app.use("/api/admin", adminroutes)
app.use("/api/coach", coachRoutes);
app.use("/api/referee", refereeRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/auth", authRoutes);
/*app.use("/api/auth/reset-password", resetpasswordRoutes);*/
app.use("/api", testRoutes);

export default app;

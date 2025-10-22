import { pgTable, serial, varchar, date, integer, decimal,text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 15 }).unique(),
  password: varchar("password", { length: 255 }),
  role: text("role"), // "admin" | "coach" | "referee" | "player"
  status: varchar("status", { length: 20 }).default("pending"),
  phase2_completed: boolean("phase2_completed").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow()
});


// 🧑‍🏫 COACHES TABLE
export const coaches = pgTable(
  "coaches",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull().unique(),
    date_of_birth: date("date_of_birth").notNull(),
    age: integer("age").unique(),
    gender: varchar("gender", { length: 10 }),
    nationality: varchar("nationality", { length: 50 }),
    address: varchar("address", { length: 255 }),
    experience_years: integer("experience_years").default(0),
    certifications: text("certifications"),
    status: varchar("status", { length: 20 }).default("active"),
    profile_image: varchar("profile_image", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      unique_coach: uniqueIndex("unique_coach").on(table.user_id),
    };
  }
);





// 🧑‍⚖️ REFEREES TABLE
export const referees = pgTable(
  "referees",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull().unique(),
    date_of_birth: date("date_of_birth").notNull(),
    gender: varchar("gender", { length: 10 }),
    age: integer("age").unique(),
    nationality: varchar("nationality", { length: 50 }),
    address: varchar("address", { length: 255 }),
    certification_level: varchar("certification_level", { length: 50 }),
    experience_years: integer("experience_years").default(0),
    status: varchar("status", { length: 20 }).default("active"),
    matches_officiated: integer("matches_officiated").default(0),
    profile_image: varchar("profile_image", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      unique_referee: uniqueIndex("unique_referee").on(table.user_id), 
    };
  }
);






// 🏟️ TEAMS TABLE
export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    abbreviation: varchar("abbreviation", { length: 10 }),
    founded_year: integer("founded_year"),
    city: varchar("city", { length: 100 }),
    stadium_name: varchar("stadium_name", { length: 100 }),
    coach_id: integer("coach_id").references(() => coaches.id).notNull().unique(),
    country: varchar("country", { length: 50 }),
    join_code: varchar("join_code", { length: 10 }).unique(),
    approval_status: varchar("approval_status").default("pending"), // 'pending' | 'approved'
    created_by: varchar("created_by").notNull(),  
    team_logo: varchar("team_logo", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      unique_team_name: uniqueIndex("unique_team_name").on(table.name),
      unique_team_abbr: uniqueIndex("unique_team_abbr").on(table.abbreviation),
    };
  }
);







// 👟 PLAYERS TABLE
export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull().unique(),
    date_of_birth: date("date_of_birth").notNull(),
    age: integer("age").unique(),
    gender: varchar("gender", { length: 10 }),
    nationality: varchar("nationality", { length: 50 }),
    position: varchar("position", { length: 30 }),
    isSubstitute:boolean("issubstitute").default(false),
    jersey_number: integer("jersey_number").unique(),
    team_id: integer("team_id").references(() => teams.id),
    coach_id: integer("coach_id").references(() => coaches.id).notNull(),
    join_code: varchar("join_code", { length: 10 }), // optional for auto-approval
    team_approval: varchar("team_approval", { length: 20 }).default("pending"),// pending/approved/rejected
    height: decimal("height", { precision: 5, scale: 2 }),
    weight: decimal("weight", { precision: 5, scale: 2 }),
    preferred_foot: varchar("preferred_foot", { length: 10 }),
    injury_status: varchar("injury_status", { length: 20 }).default("healthy"),
    fitness_level: decimal("fitness_level", { precision: 5, scale: 2 }).default('100'),
    contract_start_date: date("contract_start_date"),
    contract_end_date: date("contract_end_date"),
    player_image: varchar("player_image", { length: 255 }),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      unique_player: uniqueIndex("unique_player").on(table.team_id, table.jersey_number,table.date_of_birth),
    };

  }
);



// 🧾 PLAYER STATS TABLE (auto-generated from matches)
export const player_stats = pgTable("player_stats", {
  id: serial("id").primaryKey(),
  player_id: integer("player_id").references(() => players.id).notNull(),
                  // 📊 Performance stats
  matches_played: integer("matches_played").default(0),
  goals_scored: integer("goals_scored").default(0),
  assists: integer("assists").default(0),
  yellow_cards: integer("yellow_cards").default(0),
  red_cards: integer("red_cards").default(0),
  clean_sheets: integer("clean_sheets").default(0),
  saves: integer("saves").default(0),
  goals_conceded: integer("goals_conceded").default(0),

  // 🏅 Evaluation
  player_rating: decimal("player_rating", { precision: 4, scale: 2 }).default("0"),
  scouting_notes: text("scouting_notes"),
  awards: text("awards"),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  market_value: decimal("market_value", { precision: 12, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
});




// ⚽ MATCHES TABLE
export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    home_team_id: integer("home_team_id").references(() => teams.id).notNull(),
    away_team_id: integer("away_team_id").references(() => teams.id).notNull(),
    referee_id: integer("referee_id").references(() => referees.id).notNull(),
    match_date: timestamp("match_date", { withTimezone: true }).notNull(),
    venue: varchar("venue", { length: 100 }),
    status: varchar("status", { length: 20 }).default("scheduled"),
    duration_minutes: integer("duration_minutes").default(90),
    match_officials: text("match_officials"),
    weather_conditions: varchar("weather_conditions", { length: 100 }),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      // ✅ Prevent duplicate match entries between same teams, date, and sport
      unique_match: uniqueIndex("unique_match").on(
        table.home_team_id,
        table.away_team_id,
        table.match_date,
      ),
    };
  }
);

// ------------------------
// Results table
// ------------------------
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  match_id: integer("match_id").references(() => matches.id).notNull().unique(),
  home_team_score: integer("home_team_score").default(0),
  away_team_score: integer("away_team_score").default(0),
  half_time_score: varchar("half_time_score", { length: 20 }),
  man_of_the_match: integer("man_of_the_match").references(() => players.id),
  approved: boolean("approved").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

//........................
// news table
//........................
export const news = pgTable("news", {
  id: serial("id").primaryKey(),

  author_id: integer("author_id")  // 🟩 Added this line
    .references(() => users.id)
    .notNull(), // each news item must have an author

  title: varchar("title", { length: 255 }).notNull(),

  content: text("content").notNull(),

  image_url: varchar("image_url", { length: 500 }),

  role: varchar("role", { length: 50 }).notNull(),

  status: varchar("status", { length: 50 })
    .default("pending")
    .notNull(), // pending | approved | rejected

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});


//..........................
//team standings table
//..........................

export const standings = pgTable("standings", {
  id: serial("id").primaryKey(),
  team_id: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  played: integer("played").default(0),     // PL
  wins: integer("wins").default(0),         // W
  draws: integer("draws").default(0),       // D
  losses: integer("losses").default(0),     // L
  goals_for: integer("goals_for").default(0), // GF
  goals_against: integer("goals_against").default(0), // GA
  goal_difference: integer("goal_difference").default(0), // GD
  points: integer("points").default(0),     // PTS
  updated_at: timestamp("updated_at").defaultNow(),
});
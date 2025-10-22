CREATE TABLE "coaches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" varchar(10),
	"nationality" varchar(50),
	"address" varchar(255),
	"specialization" varchar(50),
	"experience_years" integer DEFAULT 0,
	"certifications" text,
	"joining_date" date,
	"contract_end_date" date,
	"status" varchar(20) DEFAULT 'active',
	"profile_image" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "coaches_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"home_team_id" integer NOT NULL,
	"away_team_id" integer NOT NULL,
	"referee_id" integer NOT NULL,
	"match_date" timestamp with time zone NOT NULL,
	"venue" varchar(100),
	"status" varchar(20) DEFAULT 'scheduled',
	"duration_minutes" integer DEFAULT 90,
	"match_officials" text,
	"weather_conditions" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"image_url" varchar(500),
	"role" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"matches_played" integer DEFAULT 0,
	"goals_scored" integer DEFAULT 0,
	"assists" integer DEFAULT 0,
	"yellow_cards" integer DEFAULT 0,
	"red_cards" integer DEFAULT 0,
	"clean_sheets" integer DEFAULT 0,
	"saves" integer DEFAULT 0,
	"goals_conceded" integer DEFAULT 0,
	"player_rating" numeric(4, 2) DEFAULT '0',
	"scouting_notes" text,
	"awards" text,
	"salary" numeric(12, 2),
	"market_value" numeric(12, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" varchar(10),
	"nationality" varchar(50),
	"position" varchar(30),
	"issubstitute" boolean DEFAULT false,
	"jersey_number" integer,
	"team_id" integer,
	"coach_id" integer NOT NULL,
	"join_code" varchar(10),
	"team_approval" varchar(20) DEFAULT 'pending',
	"height" numeric(5, 2),
	"weight" numeric(5, 2),
	"preferred_foot" varchar(10),
	"injury_status" varchar(20) DEFAULT 'healthy',
	"fitness_level" numeric(5, 2) DEFAULT '100',
	"contract_start_date" date,
	"contract_end_date" date,
	"player_image" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "players_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "players_jersey_number_unique" UNIQUE("jersey_number")
);
--> statement-breakpoint
CREATE TABLE "referees" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" varchar(10),
	"nationality" varchar(50),
	"address" varchar(255),
	"certification_level" varchar(50),
	"experience_years" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'active',
	"matches_officiated" integer DEFAULT 0,
	"profile_image" varchar(255),
	"joining_date" date,
	"contract_end_date" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "referees_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "results" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"home_team_score" integer DEFAULT 0,
	"away_team_score" integer DEFAULT 0,
	"half_time_score" varchar(20),
	"man_of_the_match" integer,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "results_match_id_unique" UNIQUE("match_id")
);
--> statement-breakpoint
CREATE TABLE "standings" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"played" integer DEFAULT 0,
	"wins" integer DEFAULT 0,
	"draws" integer DEFAULT 0,
	"losses" integer DEFAULT 0,
	"goals_for" integer DEFAULT 0,
	"goals_against" integer DEFAULT 0,
	"goal_difference" integer DEFAULT 0,
	"points" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"abbreviation" varchar(10),
	"founded_year" integer,
	"city" varchar(100),
	"stadium_name" varchar(100),
	"coach_id" integer NOT NULL,
	"country" varchar(50),
	"join_code" varchar(10),
	"approval_status" varchar DEFAULT 'pending',
	"created_by" varchar NOT NULL,
	"team_logo" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "teams_coach_id_unique" UNIQUE("coach_id"),
	CONSTRAINT "teams_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(255),
	"phone" varchar(15),
	"password" varchar(255),
	"role" text,
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_referee_id_referees_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."referees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referees" ADD CONSTRAINT "referees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_man_of_the_match_players_id_fk" FOREIGN KEY ("man_of_the_match") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_coach" ON "coaches" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_match" ON "matches" USING btree ("home_team_id","away_team_id","match_date");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_player" ON "players" USING btree ("team_id","jersey_number","date_of_birth");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_referee" ON "referees" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_team_name" ON "teams" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_team_abbr" ON "teams" USING btree ("abbreviation");
ALTER TABLE "coaches" RENAME COLUMN "dateOfBirth" TO "date_of_birth";--> statement-breakpoint
ALTER TABLE "players" RENAME COLUMN "dateOfBirth" TO "date_of_birth";--> statement-breakpoint
ALTER TABLE "referees" RENAME COLUMN "dateOfBirth" TO "date_of_birth";--> statement-breakpoint
DROP INDEX "unique_player";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_player" ON "players" USING btree ("team_id","jersey_number","date_of_birth");
DROP INDEX "unique_player";--> statement-breakpoint
ALTER TABLE "coaches" ADD COLUMN "dateOfBirth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "dateOfBirth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "referees" ADD COLUMN "dateOfBirth" date NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_player" ON "players" USING btree ("team_id","jersey_number","dateOfBirth");--> statement-breakpoint
ALTER TABLE "coaches" DROP COLUMN "date_of_birth";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "date_of_birth";--> statement-breakpoint
ALTER TABLE "referees" DROP COLUMN "date_of_birth";
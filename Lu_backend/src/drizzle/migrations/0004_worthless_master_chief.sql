ALTER TABLE "coaches" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "coaches" DROP COLUMN "joining_date";--> statement-breakpoint
ALTER TABLE "coaches" DROP COLUMN "contract_end_date";--> statement-breakpoint
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_age_unique" UNIQUE("age");
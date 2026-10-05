CREATE TABLE "school_accounts" (
	"id" serial PRIMARY KEY,
	"civil_id" text NOT NULL,
	"noor_password" text NOT NULL,
	"user_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "planets";--> statement-breakpoint
CREATE UNIQUE INDEX "school_accounts_civil_id_idx" ON "school_accounts" ("civil_id");
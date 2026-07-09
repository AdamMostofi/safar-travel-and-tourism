import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_assistant_actions_type" AS ENUM('route');
  CREATE TABLE IF NOT EXISTS "site_settings_assistant_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"emoji" varchar,
  	"type" "enum_site_settings_assistant_actions_type" DEFAULT 'route' NOT NULL,
  	"target" varchar
  );
  
  DO $$ BEGIN
   ALTER TABLE "site_settings_assistant_actions" ADD CONSTRAINT "site_settings_assistant_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "site_settings_assistant_actions_order_idx" ON "site_settings_assistant_actions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_assistant_actions_parent_id_idx" ON "site_settings_assistant_actions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_assistant_actions" CASCADE;
  DROP TYPE "public"."enum_site_settings_assistant_actions_type";`)
}

import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_settings_assistant_actions_type" ADD VALUE 'faq';
  ALTER TABLE "site_settings_assistant_actions" ADD COLUMN "answer" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_assistant_actions" DROP COLUMN IF EXISTS "answer";
  ALTER TABLE "public"."site_settings_assistant_actions" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_assistant_actions_type";
  CREATE TYPE "public"."enum_site_settings_assistant_actions_type" AS ENUM('route');
  ALTER TABLE "public"."site_settings_assistant_actions" ALTER COLUMN "type" SET DATA TYPE "public"."enum_site_settings_assistant_actions_type" USING "type"::"public"."enum_site_settings_assistant_actions_type";`)
}

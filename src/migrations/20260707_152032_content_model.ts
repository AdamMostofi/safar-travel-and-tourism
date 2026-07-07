import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "packages_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "packages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"hero_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cruises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"duration" varchar NOT NULL,
  	"starting_price" numeric NOT NULL,
  	"information" varchar NOT NULL,
  	"hero_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cruises_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings_mobiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"landline" varchar,
  	"email" varchar,
  	"address" varchar,
  	"whatsapp" varchar,
  	"socials_instagram" varchar,
  	"socials_facebook" varchar,
  	"proof_metrics_years_experience" numeric,
  	"proof_metrics_destinations_count" numeric,
  	"proof_metrics_flight_bookings" numeric,
  	"proof_metrics_amazing_tours" numeric,
  	"proof_metrics_happy_clients" numeric,
  	"proof_metrics_cruises_bookings" numeric,
  	"footer_tagline" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "packages" ADD COLUMN "destination_id" integer;
  ALTER TABLE "packages" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "packages" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "destinations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cruises_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  DO $$ BEGIN
   ALTER TABLE "packages_inclusions" ADD CONSTRAINT "packages_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "packages_rels" ADD CONSTRAINT "packages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "packages_rels" ADD CONSTRAINT "packages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cruises" ADD CONSTRAINT "cruises_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "cruises_rels" ADD CONSTRAINT "cruises_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_settings_mobiles" ADD CONSTRAINT "site_settings_mobiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "packages_inclusions_order_idx" ON "packages_inclusions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "packages_inclusions_parent_id_idx" ON "packages_inclusions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "packages_rels_order_idx" ON "packages_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "packages_rels_parent_idx" ON "packages_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "packages_rels_path_idx" ON "packages_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "packages_rels_media_id_idx" ON "packages_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "cruises_slug_idx" ON "cruises" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "cruises_hero_image_idx" ON "cruises" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "cruises_updated_at_idx" ON "cruises" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "cruises_created_at_idx" ON "cruises" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "cruises_rels_order_idx" ON "cruises_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "cruises_rels_parent_idx" ON "cruises_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "cruises_rels_path_idx" ON "cruises_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "cruises_rels_media_id_idx" ON "cruises_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_source_url_idx" ON "media" USING btree ("source_url");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "site_settings_mobiles_order_idx" ON "site_settings_mobiles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_mobiles_parent_id_idx" ON "site_settings_mobiles" USING btree ("_parent_id");
  DO $$ BEGIN
   ALTER TABLE "packages" ADD CONSTRAINT "packages_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "packages" ADD CONSTRAINT "packages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cruises_fk" FOREIGN KEY ("cruises_id") REFERENCES "public"."cruises"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "packages_destination_idx" ON "packages" USING btree ("destination_id");
  CREATE INDEX IF NOT EXISTS "packages_hero_image_idx" ON "packages" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cruises_id_idx" ON "payload_locked_documents_rels" USING btree ("cruises_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages_inclusions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "packages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cruises_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_mobiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "packages_inclusions" CASCADE;
  DROP TABLE "packages_rels" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "cruises" CASCADE;
  DROP TABLE "cruises_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "site_settings_mobiles" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  ALTER TABLE "packages" DROP CONSTRAINT "packages_destination_id_destinations_id_fk";
  
  ALTER TABLE "packages" DROP CONSTRAINT "packages_hero_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_destinations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cruises_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  
  DROP INDEX IF EXISTS "packages_destination_idx";
  DROP INDEX IF EXISTS "packages_hero_image_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_destinations_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_cruises_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "packages" DROP COLUMN IF EXISTS "destination_id";
  ALTER TABLE "packages" DROP COLUMN IF EXISTS "hero_image_id";
  ALTER TABLE "packages" DROP COLUMN IF EXISTS "featured";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "destinations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cruises_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_id";`)
}

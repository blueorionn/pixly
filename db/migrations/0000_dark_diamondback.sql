CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "collections_position_check" CHECK ("collections"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "photo_collections" (
	"photo_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "photo_collections_photo_id_collection_id_pk" PRIMARY KEY("photo_id","collection_id")
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"file_size" bigint NOT NULL,
	"mime_type" text NOT NULL,
	"storage_key" text NOT NULL,
	"hash" text NOT NULL,
	"is_nsfw" boolean DEFAULT false NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "photos_width_check" CHECK ("photos"."width" > 0),
	CONSTRAINT "photos_height_check" CHECK ("photos"."height" > 0),
	CONSTRAINT "photos_file_size_check" CHECK ("photos"."file_size" > 0)
);
--> statement-breakpoint
ALTER TABLE "photo_collections" ADD CONSTRAINT "photo_collections_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_collections" ADD CONSTRAINT "photo_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "collections_slug_unique" ON "collections" USING btree ("slug") WHERE "collections"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "collections_created_by_position_idx" ON "collections" USING btree ("created_by","position") WHERE "collections"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX "photo_collections_collection_added_idx" ON "photo_collections" USING btree ("collection_id","added_at");--> statement-breakpoint
CREATE UNIQUE INDEX "photos_slug_unique" ON "photos" USING btree ("slug") WHERE "photos"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "photos_storage_key_unique" ON "photos" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at" DESC NULLS LAST) WHERE "photos"."deleted_at" is null;
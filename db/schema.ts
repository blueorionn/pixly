import { sql } from 'drizzle-orm'
import {
  primaryKey,
  uniqueIndex,
  index,
  boolean,
  check,
  integer,
  bigint,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const photos = pgTable(
  'photos',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    uploadedBy: uuid('uploaded_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    mimeType: text('mime_type').notNull(),
    storageKey: text('storage_key').notNull(),
    hash: text('hash').notNull(),
    isNsfw: boolean('is_nsfw').notNull().default(false),
    isHidden: boolean('is_hidden').notNull().default(false),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('photos_slug_unique')
      .on(table.slug)
      .where(sql`${table.deletedAt} is null`),
    uniqueIndex('photos_storage_key_unique').on(table.storageKey),
    index('photos_created_at_idx')
      .on(table.createdAt.desc())
      .where(sql`${table.deletedAt} is null`),
    check('photos_width_check', sql`${table.width} > 0`),
    check('photos_height_check', sql`${table.height} > 0`),
    check('photos_file_size_check', sql`${table.fileSize} > 0`),
  ]
)

export const collections = pgTable(
  'collections',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    createdBy: uuid('created_by').notNull(),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('collections_slug_unique')
      .on(table.slug)
      .where(sql`${table.deletedAt} is null`),
    index('collections_created_by_position_idx')
      .on(table.createdBy, table.position)
      .where(sql`${table.deletedAt} is null`),
    check('collections_position_check', sql`${table.position} >= 0`),
  ]
)

// JOIN table
export const photoCollections = pgTable(
  'photo_collections',
  {
    photoId: uuid('photo_id')
      .notNull()
      .references(() => photos.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.photoId, table.collectionId] }),
    index('photo_collections_collection_added_idx').on(
      table.collectionId,
      table.addedAt
    ),
  ]
)

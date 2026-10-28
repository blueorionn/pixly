import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  // Session pooler URL — used for migrations (DDL).
  // The runtime app connects via the transaction pooler instead.
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})

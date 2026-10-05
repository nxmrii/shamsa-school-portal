import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const schoolAccounts = pgTable(
  'school_accounts',
  {
    id: serial('id').primaryKey(),

    civilId: text('civil_id').notNull(),

    noorPassword: text('noor_password').notNull(),

    userType: text('user_type').notNull(),

    createdAt: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('school_accounts_civil_id_idx').on(table.civilId),
  ],
)
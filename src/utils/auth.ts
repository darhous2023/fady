import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  // Explicit max: this is a SEPARATE pool from src/lib/db/drizzle/connection.ts's
  // postgres-js client, both against the same DATABASE_URL. Confirmed via live
  // Vercel logs + a directly-reproduced EMAXCONNSESSION this session that the
  // two pools' combined size was exceeding the session-mode pooler's 15-
  // connection cap under real concurrency. Keep this small — DATABASE_URL is
  // meant to run on the transaction-mode pooler (6543), where connections are
  // held only for the duration of a single query, not per session.
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  plugins: [
    admin(),
  ],
});

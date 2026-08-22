import { Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";

// Next.js loads .env.local for us, but standalone scripts (seed, db:push) don't.
// dotenv never overrides an already-set variable, so this is safe in both.
dotenv.config({ path: ".env.local" });

const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in .env.local — the database layer cannot start.`);
  }
}

function create() {
  return new Sequelize({
    dialect: "postgres",
    // Handed in explicitly: Sequelize's own require("pg") is invisible to the
    // Next bundler and fails with "Please install pg package manually".
    dialectModule: pg,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    },
  });
}

// Next's dev server re-evaluates modules on every hot reload. Without this cache
// each reload would open a fresh pool and the connection count would climb.
const globalForDb = globalThis as unknown as { __portfolioSequelize?: Sequelize };

export const sequelize = globalForDb.__portfolioSequelize ?? create();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__portfolioSequelize = sequelize;
}

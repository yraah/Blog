// lib/db.ts
// Renamed from env.ts — this file handles the DB connection, not env config.
// All credentials come from environment variables (never hardcoded).

import mysql from "mysql2/promise";

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_NAME
) {
  throw new Error(
    "Missing required database environment variables. Check your .env.local file."
  );
}


export const db = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME,
  port:     Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

import { ClientConfig } from "pg";

export const dbConfig: ClientConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};

import { ClientConfig } from "pg";

export const dbConfig: ClientConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : true,
  connectionTimeoutMillis: 10000,
  query_timeout: 60000,
};

export const neonConfig = {
  fetchConnectionCache: true,
  retries: 3,
  retryDelay: 1000,
};

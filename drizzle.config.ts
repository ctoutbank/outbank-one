import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://outbank_owner:UPjyn54wJgXO@ep-bold-field-a5mbqp2a-pooler.us-east-2.aws.neon.tech/outbank?sslmode=require",
  },
  schema: "./src/server/db/schema",
});

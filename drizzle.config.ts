import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://outbank_owner:UPjyn54wJgXO@ep-blue-rain-a5ord0tf.us-east-2.aws.neon.tech/outbank?sslmode=require",
  },
  schema: "./src/server/db/schema",
});

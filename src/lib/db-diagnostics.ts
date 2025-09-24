import { Client } from 'pg';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export interface ConnectionTestResult {
  method: string;
  success: boolean;
  error?: string;
  details?: any;
  timing?: number;
}

export async function testDatabaseConnections(): Promise<ConnectionTestResult[]> {
  const results: ConnectionTestResult[] = [];
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    return [{
      method: 'Environment Check',
      success: false,
      error: 'DATABASE_URL not found in environment variables'
    }];
  }

  const startTime1 = Date.now();
  try {
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    results.push({
      method: 'PostgreSQL Client',
      success: true,
      timing: Date.now() - startTime1
    });
  } catch (error: any) {
    results.push({
      method: 'PostgreSQL Client',
      success: false,
      error: error.message,
      details: { code: error.code, errno: error.errno }
    });
  }

  const startTime2 = Date.now();
  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1 as test`;
    results.push({
      method: 'Neon HTTP',
      success: true,
      timing: Date.now() - startTime2
    });
  } catch (error: any) {
    results.push({
      method: 'Neon HTTP',
      success: false,
      error: error.message,
      details: { code: error.code, errno: error.errno }
    });
  }

  const startTime3 = Date.now();
  try {
    const sql = neon(databaseUrl);
    drizzle(sql);
    await sql`SELECT 1 as test`;
    results.push({
      method: 'Drizzle + Neon HTTP',
      success: true,
      timing: Date.now() - startTime3
    });
  } catch (error: any) {
    results.push({
      method: 'Drizzle + Neon HTTP',
      success: false,
      error: error.message,
      details: { code: error.code, errno: error.errno }
    });
  }

  return results;
}

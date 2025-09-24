#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the connection to Neon Postgres database
 * Usage: npm run db:test
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in environment variables');
    console.log('💡 Make sure you have a .env.local file with DATABASE_URL configured');
    console.log('📖 Check the .env.example file for the correct format');
    process.exit(1);
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('📡 Connecting to database...');
    
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Database connection successful!');
    console.log(`⏰ Server time: ${result[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result[0].pg_version.split(' ')[0]}`);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log(`\n📊 Found ${tables.length} tables in the database:`);
    tables.slice(0, 10).forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    if (tables.length > 10) {
      console.log(`   ... and ${tables.length - 10} more tables`);
    }
    
    console.log('\n🎉 Database is ready for development!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your DATABASE_URL credentials');
      console.log('   - Verify your Neon database is active');
      console.log('   - Ensure your IP is whitelisted in Neon settings');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check the database name in your DATABASE_URL');
      console.log('   - Verify the database exists in your Neon project');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Neon service status');
    }
    
    process.exit(1);
  }
}

testConnection().catch(console.error);

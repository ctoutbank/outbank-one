#!/usr/bin/env node

/**
 * Database Seed Script
 * Seeds the database with initial data for development
 * Usage: npm run db:seed
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in environment variables');
    console.log('💡 Make sure you have a .env.local file with DATABASE_URL configured');
    process.exit(1);
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('📡 Connecting to database...');
    
    const existingData = await sql`SELECT COUNT(*) as count FROM customers`;
    const customerCount = parseInt(existingData[0].count);
    
    if (customerCount > 0) {
      console.log(`⚠️  Database already contains ${customerCount} customers`);
      console.log('🤔 Continuing with seeding additional test data...');
    }
    
    console.log('🌱 Seeding basic configuration data...');
    await seedBasicData(sql);
    
    console.log('👥 Seeding sample customer and merchant data...');
    await seedBusinessData(sql);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('💡 You can now run the application with sample data');
    
  } catch (error) {
    console.error('❌ Database seeding failed:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n💡 It looks like database tables don\'t exist yet.');
      console.log('   Run: npm run db:push');
      console.log('   Then try seeding again: npm run db:seed');
    }
    
    process.exit(1);
  }
}

async function seedBasicData(sql) {
  try {
    await sql`
      INSERT INTO state (code, name) VALUES 
      ('SP', 'São Paulo'),
      ('RJ', 'Rio de Janeiro'),
      ('MG', 'Minas Gerais'),
      ('RS', 'Rio Grande do Sul'),
      ('PR', 'Paraná'),
      ('SC', 'Santa Catarina'),
      ('BA', 'Bahia'),
      ('GO', 'Goiás'),
      ('PE', 'Pernambuco'),
      ('CE', 'Ceará')
      ON CONFLICT (code) DO NOTHING
    `;
    
    await sql`
      INSERT INTO country (code, name) VALUES 
      ('BR', 'Brasil'),
      ('US', 'Estados Unidos'),
      ('AR', 'Argentina'),
      ('UY', 'Uruguai'),
      ('PY', 'Paraguai')
      ON CONFLICT (code) DO NOTHING
    `;
    
    await sql`
      INSERT INTO city (code, name) VALUES 
      ('SP001', 'São Paulo'),
      ('RJ001', 'Rio de Janeiro'),
      ('MG001', 'Belo Horizonte'),
      ('RS001', 'Porto Alegre'),
      ('PR001', 'Curitiba'),
      ('SC001', 'Florianópolis'),
      ('BA001', 'Salvador'),
      ('GO001', 'Goiânia'),
      ('PE001', 'Recife'),
      ('CE001', 'Fortaleza')
      ON CONFLICT (code) DO NOTHING
    `;
    
    await sql`
      INSERT INTO bank (active, dtinsert, dtupdate, name, number) VALUES 
      (true, NOW(), NOW(), 'Banco do Brasil', '001'),
      (true, NOW(), NOW(), 'Bradesco', '237'),
      (true, NOW(), NOW(), 'Itaú Unibanco', '341'),
      (true, NOW(), NOW(), 'Santander', '033'),
      (true, NOW(), NOW(), 'Caixa Econômica Federal', '104'),
      (true, NOW(), NOW(), 'Banco Inter', '077'),
      (true, NOW(), NOW(), 'Nubank', '260'),
      (true, NOW(), NOW(), 'Banco Original', '212'),
      (true, NOW(), NOW(), 'Banco C6', '336'),
      (true, NOW(), NOW(), 'Banco Next', '237')
      ON CONFLICT DO NOTHING
    `;
    
    await sql`
      INSERT INTO report_types (code, name) VALUES 
      ('TXN', 'Transações'),
      ('STL', 'Liquidações'),
      ('MER', 'Comerciantes'),
      ('FIN', 'Financeiro'),
      ('ANT', 'Antecipações'),
      ('PIX', 'PIX'),
      ('TER', 'Terminais'),
      ('USR', 'Usuários')
      ON CONFLICT (code) DO NOTHING
    `;
    
    await sql`
      INSERT INTO account_type (code, name) VALUES 
      ('CC', 'Conta Corrente'),
      ('CP', 'Conta Poupança'),
      ('CS', 'Conta Salário'),
      ('CI', 'Conta Investimento')
      ON CONFLICT (code) DO NOTHING
    `;
    
    await sql`
      INSERT INTO brand (code, name) VALUES 
      ('VISA', 'Visa'),
      ('MASTER', 'Mastercard'),
      ('ELO', 'Elo'),
      ('AMEX', 'American Express'),
      ('HIPER', 'Hipercard'),
      ('DINR', 'Diners Club')
      ON CONFLICT (code) DO NOTHING
    `;
    
    console.log('✅ Basic configuration data seeded');
  } catch (error) {
    console.log(`⚠️  Some basic data may already exist: ${error.message}`);
  }
}

async function seedBusinessData(sql) {
  try {
    const customers = await sql`
      INSERT INTO customers (slug, name, customer_id, settlement_management_type, is_active) VALUES 
      ('outbank-demo', 'Outbank Demo Customer', 'DEMO001', 'AUTOMATIC', true),
      ('test-customer', 'Test Customer Ltd', 'TEST001', 'MANUAL', true),
      ('sample-corp', 'Sample Corporation', 'SAMPLE001', 'AUTOMATIC', true)
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug
    `;
    
    if (customers.length > 0) {
      const customerId = customers[0].id;
      const customerSlug = customers[0].slug;
      
      await sql`
        INSERT INTO categories (slug, active, dtinsert, dtupdate, name, mcc) VALUES 
        ('restaurants', true, NOW(), NOW(), 'Restaurantes', '5812'),
        ('retail', true, NOW(), NOW(), 'Varejo', '5999'),
        ('services', true, NOW(), NOW(), 'Serviços', '7299'),
        ('supermarkets', true, NOW(), NOW(), 'Supermercados', '5411'),
        ('gas-stations', true, NOW(), NOW(), 'Postos de Combustível', '5542'),
        ('pharmacies', true, NOW(), NOW(), 'Farmácias', '5912'),
        ('clothing', true, NOW(), NOW(), 'Vestuário', '5651'),
        ('electronics', true, NOW(), NOW(), 'Eletrônicos', '5732')
        ON CONFLICT (slug) DO NOTHING
      `;
      
      await sql`
        INSERT INTO legal_natures (slug, active, dtinsert, dtupdate, name) VALUES 
        ('ltda', true, NOW(), NOW(), 'Sociedade Limitada'),
        ('mei', true, NOW(), NOW(), 'Microempreendedor Individual'),
        ('sa', true, NOW(), NOW(), 'Sociedade Anônima'),
        ('eireli', true, NOW(), NOW(), 'Empresa Individual de Responsabilidade Limitada'),
        ('ei', true, NOW(), NOW(), 'Empresário Individual')
        ON CONFLICT (slug) DO NOTHING
      `;
      
      await sql`
        INSERT INTO merchants (
          slug, active, dtinsert, dtupdate, name, document_id, 
          slug_customer, id_customer, email, phone, status
        ) VALUES 
        ('demo-merchant-001', true, NOW(), NOW(), 'Loja Demo 1', '12345678000195', 
         ${customerSlug}, ${customerId}, 'demo1@example.com', '11999999999', 'ACTIVE'),
        ('demo-merchant-002', true, NOW(), NOW(), 'Restaurante Demo', '98765432000123', 
         ${customerSlug}, ${customerId}, 'demo2@example.com', '11888888888', 'ACTIVE'),
        ('demo-merchant-003', true, NOW(), NOW(), 'Farmácia Demo', '11122233000144', 
         ${customerSlug}, ${customerId}, 'demo3@example.com', '11777777777', 'ACTIVE'),
        ('demo-merchant-004', true, NOW(), NOW(), 'Posto Demo', '44455566000177', 
         ${customerSlug}, ${customerId}, 'demo4@example.com', '11666666666', 'ACTIVE')
        ON CONFLICT (slug) DO NOTHING
      `;
      
      await sql`
        INSERT INTO terminals (
          slug, active, dtinsert, dtupdate, logical_number, type, status, 
          serial_number, model, manufacturer, slug_merchant, slug_customer
        ) VALUES 
        ('terminal-001', true, NOW(), NOW(), 'LOG001', 'P', 'ACTIVE', 
         'SN001234567', 'POS-X1', 'Ingenico', 'demo-merchant-001', ${customerSlug}),
        ('terminal-002', true, NOW(), NOW(), 'LOG002', 'P', 'ACTIVE', 
         'SN002345678', 'POS-X2', 'Verifone', 'demo-merchant-002', ${customerSlug}),
        ('terminal-003', true, NOW(), NOW(), 'LOG003', 'P', 'ACTIVE', 
         'SN003456789', 'POS-X1', 'Ingenico', 'demo-merchant-003', ${customerSlug})
        ON CONFLICT (slug) DO NOTHING
      `;
      
      await sql`
        INSERT INTO users (
          slug, active, dtinsert, dtupdate, first_name, last_name, 
          email, phone, document_id, slug_customer, id_customer
        ) VALUES 
        ('demo-user-001', true, NOW(), NOW(), 'João', 'Silva', 
         'joao.silva@demo.com', '11999999999', '12345678901', ${customerSlug}, ${customerId}),
        ('demo-user-002', true, NOW(), NOW(), 'Maria', 'Santos', 
         'maria.santos@demo.com', '11888888888', '98765432109', ${customerSlug}, ${customerId})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    
    console.log('✅ Sample business data seeded');
  } catch (error) {
    console.log(`⚠️  Some business data may already exist: ${error.message}`);
  }
}

seedDatabase().catch(console.error);

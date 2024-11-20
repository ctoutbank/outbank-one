import { pgTable, uuid, boolean, timestamp, varchar, numeric, serial, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const transactions = pgTable("transactions", {
	slug: uuid().primaryKey().notNull(),
	active: boolean(),
	dtInsert: timestamp("dt_insert", { mode: 'string' }),
	dtUpdate: timestamp("dt_update", { mode: 'string' }),
	slugAuthorizer: varchar("slug_authorizer", { length: 250 }),
	slugTerminal: varchar("slug_terminal", { length: 250 }),
	slugMerchant: varchar("slug_merchant", { length: 250 }),
	merchantType: varchar("merchant_type", { length: 250 }),
	merchantName: varchar("merchant_name", { length: 500 }),
	merchantCorporateName: varchar("merchant_corporate_name", { length: 500 }),
	slugCustomer: varchar("slug_customer", { length: 250 }),
	customerName: varchar("customer_name", { length: 250 }),
	salesChannel: varchar("sales_channel", { length: 50 }),
	authorizerMerchantId: varchar("authorizer_merchant_id", { length: 50 }),
	muid: varchar({ length: 50 }),
	currency: varchar({ length: 10 }),
	totalAmount: numeric("total_amount", { precision: 15, scale:  2 }),
	transactionStatus: varchar("transaction_status", { length: 50 }),
	productType: varchar("product_type", { length: 50 }),
	rrn: varchar({ length: 50 }),
	firstDigits: varchar("first_digits", { length: 10 }),
	lastdigits: varchar({ length: 10 }),
	productorissuer: varchar({ length: 50 }),
	settlementmanagementtype: varchar({ length: 50 }),
	methodType: varchar("method_type", { length: 50 }),
	brand: varchar({ length: 50 }),
	cancelling: boolean(),
	splitType: varchar("split_type", { length: 50 }),
});

export const syncControl = pgTable("sync_control", {
	id: serial().primaryKey().notNull(),
	status: varchar({ length: 50 }).notNull(),
	countTotal: integer("count_total").notNull(),
	currentOffset: integer("current_offset").default(0).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
});

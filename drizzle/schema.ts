import { pgTable, bigint, varchar, boolean, timestamp, uuid, numeric, serial, integer, foreignKey, char, date, text, time } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const salesAgents = pgTable("sales_agents", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "sales_agents_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	documentId: varchar("document_id", { length: 50 }),
	email: varchar({ length: 255 }),
	slugCustomer: varchar("slug_customer", { length: 50 }),
});

export const configurations = pgTable("configurations", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "configurations_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	lockCpAnticipationOrder: boolean("lock_cp_anticipation_order"),
	lockCnpAnticipationOrder: boolean("lock_cnp_anticipation_order"),
	url: varchar({ length: 255 }),
});

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

export const transactionCycles = pgTable("transaction_cycles", {
	slug: varchar({ length: 255 }).primaryKey().notNull(),
	active: boolean(),
	dtInsert: timestamp("dt_insert", { mode: 'string' }),
	dtUpdate: timestamp("dt_update", { mode: 'string' }),
	slugTransaction: varchar("slug_transaction", { length: 255 }),
	processingDate: timestamp("processing_date", { mode: 'string' }),
	cycleType: varchar("cycle_type", { length: 50 }),
	cycleStatus: varchar("cycle_status", { length: 50 }),
	deviceStan: varchar("device_stan", { length: 50 }),
	gatewayStan: varchar("gateway_stan", { length: 50 }),
	responseCode: varchar("response_code", { length: 10 }),
	gatewayVersion: varchar("gateway_version", { length: 50 }),
	trackingNumber: varchar("tracking_number", { length: 50 }),
	amount: numeric({ precision: 18, scale:  2 }),
	interest: numeric({ precision: 18, scale:  2 }),
	authorizationCode: varchar("authorization_code", { length: 50 }),
	rrn: varchar({ length: 50 }),
	connectionMode: varchar("connection_mode", { length: 50 }),
	connectionDetail: varchar("connection_detail", { length: 500 }),
	application: varchar({ length: 50 }),
	applicationVersion: varchar("application_version", { length: 50 }),
	transmissionDate: timestamp("transmission_date", { mode: 'string' }),
	entryMode: varchar("entry_mode", { length: 50 }),
	requestToken: varchar("request_token", { length: 255 }),
	confirmed: boolean(),
	authorizerResponseCode: varchar("authorizer_response_code", { length: 10 }),
	authorizerResponseMessage: varchar("authorizer_response_message", { length: 255 }),
	originalStan: varchar("original_stan", { length: 50 }),
	installments: varchar({ length: 50 }),
	installmenttype: varchar({ length: 50 }),
});

export const contacts = pgTable("contacts", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "contacts_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: varchar({ length: 255 }),
	idDocument: varchar("id_document", { length: 20 }),
	email: varchar({ length: 255 }),
	areaCode: varchar("area_code", { length: 5 }),
	number: varchar({ length: 20 }),
	phoneType: char("phone_type", { length: 1 }),
	birthDate: date("birth_date"),
	mothersName: varchar("mothers_name", { length: 255 }),
	isPartnerContact: boolean("is_partner_contact"),
	isPep: boolean("is_pep"),
	idMerchant: integer("id_merchant"),
	slugMerchant: varchar("slug_merchant", { length: 50 }),
	idAddress: integer("id_address"),
}, (table) => {
	return {
		contactsIdAddressFkey: foreignKey({
			columns: [table.idAddress],
			foreignColumns: [addresses.id],
			name: "contacts_id_address_fkey"
		}),
		contactsIdMerchantFkey: foreignKey({
			columns: [table.idMerchant],
			foreignColumns: [merchants.id],
			name: "contacts_id_merchant_fkey"
		}),
	}
});

export const merchants = pgTable("merchants", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "merchants_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	idMerchant: varchar("id_merchant", { length: 20 }),
	name: varchar({ length: 255 }),
	idDocument: varchar("id_document", { length: 20 }),
	corporateName: varchar("corporate_name", { length: 255 }),
	email: varchar({ length: 255 }),
	areaCode: varchar("area_code", { length: 5 }),
	number: varchar({ length: 15 }),
	phoneType: char("phone_type", { length: 2 }),
	language: varchar({ length: 10 }),
	timezone: varchar({ length: 10 }),
	slugCustomer: varchar("slug_customer", { length: 50 }),
	riskAnalysisStatus: varchar("risk_analysis_status", { length: 20 }),
	riskAnalysisStatusJustification: text("risk_analysis_status_justification"),
	legalPerson: varchar("legal_person", { length: 50 }),
	openingDate: date("opening_date"),
	inclusion: varchar({ length: 255 }),
	openingDays: varchar("opening_days", { length: 10 }),
	openingHour: time("opening_hour"),
	closingHour: time("closing_hour"),
	municipalRegistration: varchar("municipal_registration", { length: 20 }),
	stateSubcription: varchar("state_subcription", { length: 20 }),
	hasTef: boolean("has_tef"),
	hasPix: boolean("has_pix"),
	hasTop: boolean("has_top"),
	establishmentFormat: varchar("establishment_format", { length: 10 }),
	revenue: numeric({ precision: 15, scale:  2 }),
	idCategory: integer("id_category"),
	slugCategory: varchar("slug_category", { length: 50 }),
	idLegalNature: integer("id_legal_nature"),
	slugLegalNature: varchar("slug_legal_nature", { length: 50 }),
	idSalesAgent: integer("id_sales_agent"),
	slugSalesAgent: varchar("slug_sales_agent", { length: 50 }),
	idConfiguration: integer("id_configuration"),
	slugConfiguration: varchar("slug_configuration", { length: 50 }),
	idAddress: integer("id_address"),
}, (table) => {
	return {
		merchantsIdCategoryFkey: foreignKey({
			columns: [table.idCategory],
			foreignColumns: [categories.id],
			name: "merchants_id_category_fkey"
		}),
		merchantsIdLegalNatureFkey: foreignKey({
			columns: [table.idLegalNature],
			foreignColumns: [legalNatures.id],
			name: "merchants_id_legal_nature_fkey"
		}),
		merchantsIdSalesAgentFkey: foreignKey({
			columns: [table.idSalesAgent],
			foreignColumns: [salesAgents.id],
			name: "merchants_id_sales_agent_fkey"
		}),
		merchantsIdConfigurationFkey: foreignKey({
			columns: [table.idConfiguration],
			foreignColumns: [configurations.id],
			name: "merchants_id_configuration_fkey"
		}),
		merchantsIdAddressFkey: foreignKey({
			columns: [table.idAddress],
			foreignColumns: [addresses.id],
			name: "merchants_id_address_fkey"
		}),
	}
});



export const addresses = pgTable("addresses", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "addresses_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	streetAddress: varchar("street_address", { length: 255 }),
	streetNumber: varchar("street_number", { length: 10 }),
	complement: varchar({ length: 100 }),
	neighborhood: varchar({ length: 50 }),
	city: varchar({ length: 50 }),
	state: varchar({ length: 20 }),
	country: varchar({ length: 20 }),
	zipCode: varchar("zip_code", { length: 15 }),
});

export const categories = pgTable("categories", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	name: varchar({ length: 255 }),
	mcc: varchar({ length: 10 }),
	cnae: varchar({ length: 25 }),
	anticipationRiskFactorCp: integer("anticipation_risk_factor_cp"),
	anticipationRiskFactorCnp: integer("anticipation_risk_factor_cnp"),
	waitingPeriodCp: integer("waiting_period_cp"),
	waitingPeriodCnp: integer("waiting_period_cnp"),
});

export const legalNatures = pgTable("legal_natures", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "legal_natures_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	name: varchar({ length: 255 }),
	code: varchar({ length: 10 }),
});

export const merchantpixaccount = pgTable("merchantpixaccount", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "merchantpixaccount_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	slug: varchar({ length: 50 }),
	active: boolean(),
	dtinsert: timestamp({ mode: 'string' }),
	dtupdate: timestamp({ mode: 'string' }),
	idRegistration: varchar("id_registration", { length: 50 }),
	idAccount: varchar("id_account", { length: 20 }),
	bankNumber: varchar("bank_number", { length: 10 }),
	bankBranchNumber: varchar("bank_branch_number", { length: 10 }),
	bankBranchDigit: varchar("bank_branch_digit", { length: 1 }),
	bankAccountNumber: varchar("bank_account_number", { length: 20 }),
	bankAccountDigit: char("bank_account_digit", { length: 1 }),
	bankAccountType: varchar("bank_account_type", { length: 10 }),
	bankAccountStatus: varchar("bank_account_status", { length: 20 }),
	onboardingPixStatus: varchar("onboarding_pix_status", { length: 20 }),
	message: text(),
	bankName: varchar("bank_name", { length: 255 }),
	idMerchant: integer("id_merchant"),
	slugMerchant: varchar("slug_merchant", { length: 50 }),
}, (table) => {
	return {
		merchantpixaccountIdMerchantFkey: foreignKey({
			columns: [table.idMerchant],
			foreignColumns: [merchants.id],
			name: "merchantpixaccount_id_merchant_fkey"
		}),
	}
});

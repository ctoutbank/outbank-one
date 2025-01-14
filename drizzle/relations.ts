import { relations } from "drizzle-orm/relations";
import { customers, settlements, paymentInstitution, merchants, merchantSettlements, merchantSettlementOrders, merchantPixSettlementOrders, categories, legalNatures, salesAgents, configurations, addresses, contacts, merchantpixaccount } from "./schema";

export const settlementsRelations = relations(settlements, ({one, many}) => ({
	customer: one(customers, {
		fields: [settlements.idCustomer],
		references: [customers.id]
	}),
	merchantSettlements: many(merchantSettlements),
}));

export const customersRelations = relations(customers, ({many}) => ({
	settlements: many(settlements),
	paymentInstitutions: many(paymentInstitution),
	merchantSettlements: many(merchantSettlements),
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
}));

export const paymentInstitutionRelations = relations(paymentInstitution, ({one, many}) => ({
	customer: one(customers, {
		fields: [paymentInstitution.idCustomerDb],
		references: [customers.id]
	}),
	merchantSettlementOrders: many(merchantSettlementOrders),
}));

export const merchantSettlementsRelations = relations(merchantSettlements, ({one, many}) => ({
	merchant: one(merchants, {
		fields: [merchantSettlements.idMerchant],
		references: [merchants.id]
	}),
	customer: one(customers, {
		fields: [merchantSettlements.idCustomer],
		references: [customers.id]
	}),
	settlement: one(settlements, {
		fields: [merchantSettlements.idSettlement],
		references: [settlements.id]
	}),
	merchantSettlementOrders: many(merchantSettlementOrders),
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
}));

export const merchantsRelations = relations(merchants, ({one, many}) => ({
	merchantSettlements: many(merchantSettlements),
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
	category: one(categories, {
		fields: [merchants.idCategory],
		references: [categories.id]
	}),
	legalNature: one(legalNatures, {
		fields: [merchants.idLegalNature],
		references: [legalNatures.id]
	}),
	salesAgent: one(salesAgents, {
		fields: [merchants.idSalesAgent],
		references: [salesAgents.id]
	}),
	configuration: one(configurations, {
		fields: [merchants.idConfiguration],
		references: [configurations.id]
	}),
	address: one(addresses, {
		fields: [merchants.idAddress],
		references: [addresses.id]
	}),
	contacts: many(contacts),
	merchantpixaccounts: many(merchantpixaccount),
}));

export const merchantSettlementOrdersRelations = relations(merchantSettlementOrders, ({one}) => ({
	paymentInstitution: one(paymentInstitution, {
		fields: [merchantSettlementOrders.idPaymentInstitution],
		references: [paymentInstitution.id]
	}),
	merchantSettlement: one(merchantSettlements, {
		fields: [merchantSettlementOrders.idMerchantSettlements],
		references: [merchantSettlements.id]
	}),
}));

export const merchantPixSettlementOrdersRelations = relations(merchantPixSettlementOrders, ({one}) => ({
	customer: one(customers, {
		fields: [merchantPixSettlementOrders.idCustomer],
		references: [customers.id]
	}),
	merchant: one(merchants, {
		fields: [merchantPixSettlementOrders.idMerchant],
		references: [merchants.id]
	}),
	merchantSettlement: one(merchantSettlements, {
		fields: [merchantPixSettlementOrders.idMerchantSettlement],
		references: [merchantSettlements.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	merchants: many(merchants),
}));

export const legalNaturesRelations = relations(legalNatures, ({many}) => ({
	merchants: many(merchants),
}));

export const salesAgentsRelations = relations(salesAgents, ({many}) => ({
	merchants: many(merchants),
}));

export const configurationsRelations = relations(configurations, ({many}) => ({
	merchants: many(merchants),
}));

export const addressesRelations = relations(addresses, ({many}) => ({
	merchants: many(merchants),
	contacts: many(contacts),
}));

export const contactsRelations = relations(contacts, ({one}) => ({
	address: one(addresses, {
		fields: [contacts.idAddress],
		references: [addresses.id]
	}),
	merchant: one(merchants, {
		fields: [contacts.idMerchant],
		references: [merchants.id]
	}),
}));

export const merchantpixaccountRelations = relations(merchantpixaccount, ({one}) => ({
	merchant: one(merchants, {
		fields: [merchantpixaccount.idMerchant],
		references: [merchants.id]
	}),
}));
import { relations } from "drizzle-orm/relations";
import { customers, paymentInstitution, settlements, merchants, payout, merchantPixSettlementOrders, merchantSettlements, merchantSettlementOrders, merchantPrice, merchantPriceGroup, merchantTransactionPrice, addresses, contacts, categories, legalNatures, salesAgents, configurations, merchantpixaccount } from "./schema";

export const paymentInstitutionRelations = relations(paymentInstitution, ({one, many}) => ({
	customer: one(customers, {
		fields: [paymentInstitution.idCustomerDb],
		references: [customers.id]
	}),
	merchantSettlementOrders: many(merchantSettlementOrders),
}));

export const customersRelations = relations(customers, ({many}) => ({
	paymentInstitutions: many(paymentInstitution),
	settlements: many(settlements),
	payouts: many(payout),
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
	merchantSettlements: many(merchantSettlements),
}));

export const settlementsRelations = relations(settlements, ({one, many}) => ({
	customer: one(customers, {
		fields: [settlements.idCustomer],
		references: [customers.id]
	}),
	merchantSettlements: many(merchantSettlements),
}));

export const payoutRelations = relations(payout, ({one}) => ({
	merchant: one(merchants, {
		fields: [payout.idMerchant],
		references: [merchants.id]
	}),
	customer: one(customers, {
		fields: [payout.idCustomer],
		references: [customers.id]
	}),
}));

export const merchantsRelations = relations(merchants, ({one, many}) => ({
	payouts: many(payout),
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
	merchantSettlements: many(merchantSettlements),
	contacts: many(contacts),
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
	merchantPrice: one(merchantPrice, {
		fields: [merchants.idMerchantPrice],
		references: [merchantPrice.id]
	}),
	merchantpixaccounts: many(merchantpixaccount),
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

export const merchantSettlementsRelations = relations(merchantSettlements, ({one, many}) => ({
	merchantPixSettlementOrders: many(merchantPixSettlementOrders),
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

export const merchantPriceGroupRelations = relations(merchantPriceGroup, ({one}) => ({
	merchantPrice: one(merchantPrice, {
		fields: [merchantPriceGroup.idMerchantPrice],
		references: [merchantPrice.id]
	}),
	merchantTransactionPrice: one(merchantTransactionPrice, {
		fields: [merchantPriceGroup.idMerchantTransactionPrice],
		references: [merchantTransactionPrice.id]
	}),
}));

export const merchantPriceRelations = relations(merchantPrice, ({many}) => ({
	merchantPriceGroups: many(merchantPriceGroup),
	merchants: many(merchants),
}));

export const merchantTransactionPriceRelations = relations(merchantTransactionPrice, ({many}) => ({
	merchantPriceGroups: many(merchantPriceGroup),
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

export const addressesRelations = relations(addresses, ({many}) => ({
	contacts: many(contacts),
	merchants: many(merchants),
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

export const merchantpixaccountRelations = relations(merchantpixaccount, ({one}) => ({
	merchant: one(merchants, {
		fields: [merchantpixaccount.idMerchant],
		references: [merchants.id]
	}),
}));
import { relations } from "drizzle-orm/relations";
import { addresses, contacts, merchants, categories, legalNatures, salesAgents, configurations, merchantpixaccount } from "./schema";

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

export const merchantsRelations = relations(merchants, ({one, many}) => ({
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
	merchantpixaccounts: many(merchantpixaccount),
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
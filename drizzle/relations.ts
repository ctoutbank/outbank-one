import { relations } from "drizzle-orm/relations";
import { customers, paymentInstitution, settlements, merchants, payout, merchantfile, file, merchantPixSettlementOrders, merchantSettlements, paymentLink, shoppingItems, profiles, profileFunctions, functions, merchantPriceGroup, merchantTransactionPrice, modules, moduleFunctions, customerFunctions, categories, legalNatures, salesAgents, configurations, addresses, merchantPrice, contacts, merchantSettlementOrders, merchantpixaccount, users } from "./schema";

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
	customerFunctions: many(customerFunctions),
	merchantSettlements: many(merchantSettlements),
	users: many(users),
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
	merchantfiles: many(merchantfile),
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
	merchantPrice: one(merchantPrice, {
		fields: [merchants.idMerchantPrice],
		references: [merchantPrice.id]
	}),
	contacts: many(contacts),
	merchantSettlements: many(merchantSettlements),
	paymentLinks: many(paymentLink),
	merchantpixaccounts: many(merchantpixaccount),
	users: many(users),
}));

export const merchantfileRelations = relations(merchantfile, ({one}) => ({
	merchant: one(merchants, {
		fields: [merchantfile.idMerchant],
		references: [merchants.id]
	}),
	file: one(file, {
		fields: [merchantfile.idFile],
		references: [file.id]
	}),
}));

export const fileRelations = relations(file, ({many}) => ({
	merchantfiles: many(merchantfile),
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

export const shoppingItemsRelations = relations(shoppingItems, ({one}) => ({
	paymentLink: one(paymentLink, {
		fields: [shoppingItems.idPaymentLink],
		references: [paymentLink.id]
	}),
}));

export const paymentLinkRelations = relations(paymentLink, ({one, many}) => ({
	shoppingItems: many(shoppingItems),
	merchant: one(merchants, {
		fields: [paymentLink.idMerchant],
		references: [merchants.id]
	}),
}));

export const profileFunctionsRelations = relations(profileFunctions, ({one}) => ({
	profile: one(profiles, {
		fields: [profileFunctions.idProfile],
		references: [profiles.id]
	}),
	function: one(functions, {
		fields: [profileFunctions.idFunctions],
		references: [functions.id]
	}),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	profileFunctions: many(profileFunctions),
	users: many(users),
}));

export const functionsRelations = relations(functions, ({many}) => ({
	profileFunctions: many(profileFunctions),
	moduleFunctions: many(moduleFunctions),
	customerFunctions: many(customerFunctions),
}));

export const merchantTransactionPriceRelations = relations(merchantTransactionPrice, ({one}) => ({
	merchantPriceGroup: one(merchantPriceGroup, {
		fields: [merchantTransactionPrice.idMerchantPriceGroup],
		references: [merchantPriceGroup.id]
	}),
}));

export const merchantPriceGroupRelations = relations(merchantPriceGroup, ({one, many}) => ({
	merchantTransactionPrices: many(merchantTransactionPrice),
	merchantPrice: one(merchantPrice, {
		fields: [merchantPriceGroup.idMerchantPrice],
		references: [merchantPrice.id]
	}),
}));

export const moduleFunctionsRelations = relations(moduleFunctions, ({one}) => ({
	module: one(modules, {
		fields: [moduleFunctions.idModule],
		references: [modules.id]
	}),
	function: one(functions, {
		fields: [moduleFunctions.idFunction],
		references: [functions.id]
	}),
}));

export const modulesRelations = relations(modules, ({many}) => ({
	moduleFunctions: many(moduleFunctions),
}));

export const customerFunctionsRelations = relations(customerFunctions, ({one}) => ({
	customer: one(customers, {
		fields: [customerFunctions.idCustomer],
		references: [customers.id]
	}),
	function: one(functions, {
		fields: [customerFunctions.idFunctions],
		references: [functions.id]
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

export const merchantPriceRelations = relations(merchantPrice, ({many}) => ({
	merchants: many(merchants),
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

export const merchantpixaccountRelations = relations(merchantpixaccount, ({one}) => ({
	merchant: one(merchants, {
		fields: [merchantpixaccount.idMerchant],
		references: [merchants.id]
	}),
}));

export const usersRelations = relations(users, ({one}) => ({
	customer: one(customers, {
		fields: [users.idCustomer],
		references: [customers.id]
	}),
	profile: one(profiles, {
		fields: [users.idProfile],
		references: [profiles.id]
	}),
	merchant: one(merchants, {
		fields: [users.idMerchant],
		references: [merchants.id]
	}),
}));
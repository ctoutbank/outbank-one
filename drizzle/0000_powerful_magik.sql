-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "transactions" (
	"slug" uuid PRIMARY KEY NOT NULL,
	"active" boolean,
	"dt_insert" timestamp,
	"dt_update" timestamp,
	"slug_authorizer" varchar(250),
	"slug_terminal" varchar(250),
	"slug_merchant" varchar(250),
	"merchant_type" varchar(250),
	"merchant_name" varchar(500),
	"merchant_corporate_name" varchar(500),
	"slug_customer" varchar(250),
	"customer_name" varchar(250),
	"sales_channel" varchar(50),
	"authorizer_merchant_id" varchar(50),
	"muid" varchar(50),
	"currency" varchar(10),
	"total_amount" numeric(15, 2),
	"transaction_status" varchar(50),
	"product_type" varchar(50),
	"rrn" varchar(50),
	"first_digits" varchar(10),
	"lastdigits" varchar(10),
	"productorissuer" varchar(50),
	"settlementmanagementtype" varchar(50),
	"method_type" varchar(50),
	"brand" varchar(50),
	"cancelling" boolean,
	"split_type" varchar(50)
);

*/
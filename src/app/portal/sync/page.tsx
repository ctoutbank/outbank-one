import AsyncButtonsAntecipations from "@/app/portal/sync/asyncButtonPauyoutAntecipation";
import type React from "react";
import AsyncButtonsCity from "./asynButtomCity";
import AsyncButtonsPage from "./asyncButtom";
import AsyncButtonsMerchantPrice from "./asyncButtomMerchantPrice";
import AsyncButtonsMerchantPriceGroup from "./asyncButtomMerchantPricegroup";
import AsyncButtonsPaymentLink from "./asyncButtonPaymentLink";
import AsyncButtonsPayout from "./asyncButtonPayouts";
import AsyncButtonsSettlement from "./asyncButtonSettlement";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="Merchant">
          <AsyncButtonsPage />
          <AsyncButtonsMerchantPrice />
          <AsyncButtonsMerchantPriceGroup />
        </Section>

        <Section title="Settlement and Payout">
          <AsyncButtonsSettlement />
          <AsyncButtonsPayout />
          <AsyncButtonsAntecipations />
        </Section>

        <Section title="Payment Link">
          <AsyncButtonsPaymentLink />
        </Section>

        <Section title="City">
          <AsyncButtonsCity />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </section>
  );
}

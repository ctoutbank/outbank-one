// pages/index.tsx

import AsyncButtonsCity from "./asynButtomCity";
import AsyncButtonsPage from "./asyncButtom";
import AsyncButtonsPayout from "./asyncButtonPayouts";
import AsyncButtonsSettlement from "./asyncButtonSettlement";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AsyncButtonsPage />
      <AsyncButtonsSettlement />
      <AsyncButtonsPayout />
      <AsyncButtonsCity />
    </div>
  );
}

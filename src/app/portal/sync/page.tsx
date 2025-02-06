// pages/index.tsx

import AsyncButtonsCity from "./asynButtomCity";
import AsyncButtonsPage from "./asyncButtom";
import AsyncButtonsSettlement from "./asyncButtonSettlement";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AsyncButtonsPage />
      <AsyncButtonsSettlement />
      <AsyncButtonsCity />
    </div>
  );
}

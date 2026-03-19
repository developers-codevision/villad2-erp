import { LiquidationForm } from "../components/LiquidationForm";
import type { CreateLiquidationDto } from "../types/types";

export default function LiquidationsPage() {
  const handleCreate = (liquidation: CreateLiquidationDto) => {
    console.log("Creating liquidation:", liquidation);
    // Here you would call the service to create
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liquidaciones</h1>
      <LiquidationForm onCancel={() => {}} onCreate={handleCreate} />
    </div>
  );
}
